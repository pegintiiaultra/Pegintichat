'use strict';
/* Vitrine PREMIUM façon e-commerce : catalogue filtrable, fiche produit, panier (localStorage), commande,
   historique, téléchargements. Les prix affichés viennent toujours du serveur. Rendu par textContent uniquement. */
(function () {
  const $ = (id) => document.getElementById(id);
  const zoneMsg = $('zone-msg-premium');
  const CLE = 'peginti_panier_v1';
  const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  const prix = (p) => (p == null ? 'Tarif à venir' : p === 0 ? 'Gratuit' : fmt(p));
  const STATUTS = { en_attente: 'En attente de paiement', validee: 'Validée', refusee: 'Refusée', annulee: 'Annulée' };
  let panier = [];
  let infosPaiement = null;
  let timerRecherche = null;

  /* ---------- panier local ---------- */
  function lirePanier() {
    try {
      const v = JSON.parse(localStorage.getItem(CLE) || '[]');
      panier = Array.isArray(v) ? v.filter((l) => Number.isInteger(l.produit_id) && Number.isInteger(l.quantite)).slice(0, 20) : [];
    } catch (e) { panier = []; }
  }
  function ecrirePanier() { try { localStorage.setItem(CLE, JSON.stringify(panier)); } catch (e) { /* ignore */ } }
  function ajouter(pid) {
    const l = panier.find((x) => x.produit_id === pid);
    if (l) l.quantite = Math.min(24, l.quantite + 1); else panier.push({ produit_id: pid, quantite: 1 });
    ecrirePanier(); majPanier(); ouvrirPanier();
  }

  async function majPanier() {
    $('nb-panier').textContent = String(panier.reduce((s, l) => s + l.quantite, 0));
    const cont = $('panier-lignes');
    cont.replaceChildren();
    $('panier-avert').replaceChildren();
    if (!panier.length) {
      cont.append(App.el('p', { class: 'indice', texte: 'Votre panier est vide.' }));
      $('panier-total').textContent = fmt(0); $('commander').disabled = true; return;
    }
    try {
      const d = await App.api('POST', '/api/premium/panier', { lignes: panier });
      const valides = new Set(d.lignes.map((l) => l.produit_id));
      panier = panier.filter((l) => valides.has(l.produit_id)); ecrirePanier();
      d.lignes.forEach((l) => {
        const moins = App.el('button', { type: 'button', class: 'discret', 'aria-label': 'Diminuer', texte: '−' });
        const plus = App.el('button', { type: 'button', class: 'discret', 'aria-label': 'Augmenter', texte: '+' });
        const sup = App.el('button', { type: 'button', class: 'discret danger', texte: 'Retirer' });
        const chg = (delta) => {
          const x = panier.find((p) => p.produit_id === l.produit_id);
          if (!x) return;
          x.quantite += delta;
          if (x.quantite < 1) panier = panier.filter((p) => p !== x);
          x.quantite = Math.min(24, x.quantite);
          ecrirePanier(); majPanier();
        };
        moins.addEventListener('click', () => chg(-1)); plus.addEventListener('click', () => chg(1));
        sup.addEventListener('click', () => { panier = panier.filter((p) => p.produit_id !== l.produit_id); ecrirePanier(); majPanier(); });
        cont.append(App.el('div', { class: 'ligne-panier' },
          App.el('div', {}, App.el('strong', { texte: l.nom }), App.el('div', { class: 'indice', texte: prix(l.prix_unitaire) + ' l’unité' })),
          App.el('strong', { texte: fmt(l.sous_total) }),
          App.el('span', { class: 'qte' }, moins, App.el('span', { texte: String(l.quantite) }), plus), sup));
      });
      $('panier-total').textContent = fmt(d.total_xaf);
      $('commander').disabled = !d.lignes.length;
      if (d.indisponibles.length) {
        App.message($('panier-avert'), 'Articles retirés du panier :', 'erreur', d.indisponibles);
        if (!panier.length) cont.append(App.el('p', { class: 'indice', texte: 'Votre panier est vide.' }));
      }
    } catch (e) { App.message($('panier-avert'), App.erreurTexte(e)); }
  }
  function ouvrirPanier() { $('panier').classList.remove('cache'); majPanier(); }
  function fermerPanier() { $('panier').classList.add('cache'); }

  async function commander() {
    if (!App.user) { location.href = '/connexion'; return; }
    const b = $('commander'); b.disabled = true;
    try {
      const r = await App.api('POST', '/api/premium/commande',
        { lignes: panier, mode_paiement: $('mode-paiement').value, note: $('note').value });
      panier = []; ecrirePanier(); majPanier();
      const z = $('panier-paiement');
      z.replaceChildren();
      App.message(z, r.message, 'ok');
      if (r.paiement) {
        z.append(App.el('div', { class: 'carte' },
          App.el('p', {}, 'Référence à indiquer : ', App.el('span', { class: 'secret', texte: r.commande.reference })),
          App.el('p', { texte: 'Total : ' + fmt(r.commande.total_xaf) + ' — ' + (r.paiement.mode || '') }),
          r.paiement.instructions ? App.el('p', { texte: r.paiement.instructions }) : null));
      }
      await App.charger();
    } catch (e) {
      if (e.statut === 401) { location.href = '/connexion'; return; }
      App.message($('panier-paiement'), App.erreurTexte(e), 'erreur', e.details);
    } finally { b.disabled = !panier.length; }
  }

  /* ---------- catalogue ---------- */
  function vignette(p) { return App.el('div', { class: 'vignette', 'aria-hidden': 'true', texte: (p.nom || '?').slice(0, 1).toUpperCase() }); }

  function carteProduit(p) {
    const voir = App.el('a', { href: '#produit-' + p.id, class: 'bouton discret-lien', texte: 'Détails' });
    const ajout = App.el('button', { type: 'button', texte: 'Ajouter au panier' });
    if (!p.disponible) { ajout.disabled = true; ajout.textContent = 'Bientôt disponible'; }
    ajout.addEventListener('click', () => ajouter(p.id));
    return App.el('article', { class: 'carte' }, vignette(p),
      App.el('div', {}, App.el('span', { class: 'badge', texte: p.type }), ' ', App.el('span', { class: 'badge', texte: p.categorie })),
      App.el('h2', {}, App.el('a', { href: '#produit-' + p.id, texte: p.nom })),
      App.el('p', { texte: p.description }),
      App.el('div', { class: 'prix pousse', texte: prix(p.prix_xaf) }),
      App.el('div', { class: 'rangee' }, ajout, voir));
  }

  async function chargerCatalogue() {
    const q = new URLSearchParams();
    if ($('f-q').value.trim()) q.set('q', $('f-q').value.trim());
    if ($('f-categorie').value) q.set('categorie', $('f-categorie').value);
    if ($('f-type').value) q.set('type', $('f-type').value);
    if ($('f-tri').value) q.set('tri', $('f-tri').value);
    try {
      const d = await App.api('GET', '/api/premium/catalogue?' + q.toString());
      const sel = $('f-categorie'), courant = sel.value;
      if (sel.options.length === 1) d.categories.forEach((c) => sel.append(App.el('option', { value: c, texte: c })));
      sel.value = courant;
      const g = $('catalogue'); g.replaceChildren();
      d.produits.forEach((p) => g.append(carteProduit(p)));
      $('vide').classList.toggle('cache', d.produits.length > 0);
    } catch (e) { App.message(zoneMsg, App.erreurTexte(e)); }
  }

  async function fiche(pid) {
    const v = $('vue-produit'); v.replaceChildren();
    try {
      const d = await App.api('GET', '/api/premium/produits/' + pid);
      const p = d.produit;
      const ajout = App.el('button', { type: 'button', texte: 'Ajouter au panier' });
      if (!p.disponible) { ajout.disabled = true; ajout.textContent = 'Tarif à venir'; }
      ajout.addEventListener('click', () => ajouter(p.id));
      const col = App.el('div', {}, App.el('h1', { texte: p.nom }),
        App.el('p', {}, App.el('span', { class: 'badge', texte: p.type }), ' ', App.el('span', { class: 'badge', texte: p.categorie }),
          p.duree_jours ? App.el('span', { class: 'badge', texte: p.duree_jours + ' jours' }) : null),
        App.el('p', { texte: p.description }), p.details ? App.el('p', { texte: p.details }) : null,
        App.el('div', { class: 'prix', texte: prix(p.prix_xaf) }), App.el('div', { class: 'rangee' }, ajout));
      if (p.versions && p.versions.length) {
        col.append(App.el('h2', { texte: 'Versions disponibles' }));
        p.versions.forEach((x) => col.append(App.el('div', { class: 'source' }, App.el('strong', { texte: `${x.version} · ${x.plateforme}` }),
          x.notes ? App.el('div', { texte: x.notes }) : null)));
      }
      v.append(App.el('a', { href: '#', class: 'retour', texte: '← Retour au catalogue' }), App.el('div', { class: 'fiche' }, vignette(p), col));
      if (d.similaires.length) {
        v.append(App.el('h2', { texte: 'Dans la même catégorie' }));
        const g = App.el('div', { class: 'grille produits' }); d.similaires.forEach((s) => g.append(carteProduit(s))); v.append(g);
      }
    } catch (e) { App.message(v, App.erreurTexte(e)); }
  }

  /* ---------- commandes, logiciels ---------- */
  function exigerCompte(vue) {
    if (App.user) return true;
    vue.replaceChildren(App.el('div', { class: 'carte' }, App.el('p', { texte: 'Connectez-vous pour accéder à cette section.' }),
      App.el('a', { class: 'bouton', href: '/connexion', texte: 'Connexion' })));
    return false;
  }

  async function vueCommandes() {
    const v = $('vue-commandes');
    if (!exigerCompte(v)) return;
    try {
      const d = await App.api('GET', '/api/premium/commandes');
      v.replaceChildren();
      if (!d.commandes.length) { v.append(App.el('p', { class: 'indice', texte: 'Aucune commande pour le moment.' })); return; }
      d.commandes.forEach((c) => {
        const bloc = App.el('div', { class: 'carte' },
          App.el('div', { class: 'rangee' }, App.el('strong', { texte: c.reference }), App.el('span', { class: 'badge', texte: STATUTS[c.statut] || c.statut }),
            App.el('span', { class: 'indice', texte: new Date(c.cree_le * 1000).toLocaleString('fr-FR') })));
        c.lignes.forEach((l) => bloc.append(App.el('div', { class: 'indice', texte: `${l.quantite} × ${l.nom} — ${fmt(l.sous_total)}` })));
        bloc.append(App.el('div', { class: 'prix', texte: 'Total ' + fmt(c.total_xaf) }));
        if (c.note) bloc.append(App.el('p', { class: 'indice', texte: c.note }));
        if (c.statut === 'en_attente') {
          const b = App.el('button', { type: 'button', class: 'danger', texte: 'Annuler' });
          b.addEventListener('click', async () => {
            b.disabled = true;
            try { await App.api('POST', `/api/premium/commandes/${c.id}/annuler`, {}); vueCommandes(); }
            catch (e) { App.message(zoneMsg, App.erreurTexte(e)); b.disabled = false; }
          });
          bloc.append(b);
        }
        v.append(bloc);
      });
    } catch (e) { App.message(v, App.erreurTexte(e)); }
  }

  async function vueLogiciels() {
    const v = $('vue-logiciels');
    if (!exigerCompte(v)) return;
    try {
      const d = await App.api('GET', '/api/premium/mes-logiciels');
      v.replaceChildren();
      if (!d.logiciels.length) { v.append(App.el('p', { class: 'indice', texte: 'Aucun logiciel disponible. Ils apparaissent ici après achat ou s’ils sont gratuits.' })); return; }
      d.logiciels.forEach((l) => v.append(App.el('div', { class: 'carte' },
        App.el('strong', { texte: `${l.produit} — ${l.version}` }), ' ', App.el('span', { class: 'badge', texte: l.plateforme }),
        App.el('p', { class: 'indice', texte: `${(l.taille / 1048576).toFixed(1)} Mo · SHA-256 ${l.sha256}` }),
        l.notes ? App.el('p', { texte: l.notes }) : null,
        App.el('a', { class: 'bouton', href: `/api/logiciels/${l.id}/telecharger`, texte: 'Télécharger' }))));
    } catch (e) { App.message(v, App.erreurTexte(e)); }
  }

  /* ---------- navigation entre vues ---------- */
  function montrer(vue) {
    ['catalogue', 'produit', 'commandes', 'logiciels', 'studio'].forEach((n) => $('vue-' + n).classList.toggle('cache', n !== vue));
    document.querySelectorAll('#onglets button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.vue === vue)));
    if (vue === 'commandes') vueCommandes();
    if (vue === 'logiciels') vueLogiciels();
  }
  function route() {
    const m = /^#produit-(\d+)$/.exec(location.hash);
    if (m) { montrer('produit'); fiche(Number(m[1])); return; }
    const vue = location.hash.slice(1);
    montrer(['commandes', 'logiciels', 'studio'].includes(vue) ? vue : 'catalogue');
  }

  async function init() {
    await App.charger();
    lirePanier();
    try {
      infosPaiement = await App.api('GET', '/api/premium/paiement');
      infosPaiement.modes.forEach((m) => $('mode-paiement').append(App.el('option', { value: m.id, texte: m.nom })));
    } catch (e) { /* ignore */ }
    $('ouvrir-panier').addEventListener('click', ouvrirPanier);
    $('fermer-panier').addEventListener('click', fermerPanier);
    $('vider').addEventListener('click', () => { panier = []; ecrirePanier(); majPanier(); });
    $('commander').addEventListener('click', commander);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fermerPanier(); });
    $('filtres').addEventListener('submit', (e) => { e.preventDefault(); chargerCatalogue(); });
    $('f-q').addEventListener('input', () => { clearTimeout(timerRecherche); timerRecherche = setTimeout(chargerCatalogue, 300); });
    ['f-categorie', 'f-type', 'f-tri'].forEach((i) => $(i).addEventListener('change', chargerCatalogue));
    document.querySelectorAll('#onglets button').forEach((b) => b.addEventListener('click', () => {
      location.hash = b.dataset.vue === 'catalogue' ? '' : b.dataset.vue;
      if (!location.hash) route();
    }));
    window.addEventListener('hashchange', route);
    await chargerCatalogue();
    majPanier();
    route();
  }
  init();
})();
