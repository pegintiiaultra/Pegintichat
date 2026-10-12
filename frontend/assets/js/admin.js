'use strict';
/* Console d'administration. Les onglets affichés dépendent des permissions du compte ; le serveur reste seul juge
   (chaque route revérifie la permission). Rendu par textContent uniquement. */
(function () {
  const $ = (id) => document.getElementById(id);
  const zone = $('contenu-admin'), zoneMsg = $('zone-msg-admin');
  const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n);
  const date = (ts) => (ts ? new Date(ts * 1000).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—');
  let perms = new Set();
  const E = (...a) => App.el(...a);

  /* ---------- confirmation TOTP (actions sensibles) ---------- */
  function demanderCode() {
    return new Promise((resolve) => {
      const dlg = $('dlg-2fa'), champ = $('code-2fa');
      champ.value = '';
      const fin = (v) => { dlg.close(); resolve(v); };
      $('form-2fa').onsubmit = (e) => { e.preventDefault(); fin(champ.value.trim()); };
      $('annuler-2fa').onclick = () => fin(null);
      dlg.addEventListener('cancel', () => resolve(null), { once: true });
      dlg.showModal(); champ.focus();
    });
  }
  /* Exécute une action sensible : demande le code, l'ajoute au corps, affiche l'erreur éventuelle. */
  async function sensible(methode, url, corps, apres) {
    const code = await demanderCode();
    if (!code) return;
    try {
      const r = await App.api(methode, url, { ...corps, code_totp: code });
      if (r.message) App.message(zoneMsg, r.message, 'ok');
      if (apres) await apres(r);
      return r;
    } catch (e) { App.message(zoneMsg, App.erreurTexte(e), 'erreur', e.details); }
  }
  async function simple(methode, url, corps, apres) {
    try {
      const r = await App.api(methode, url, corps);
      if (r.message) App.message(zoneMsg, r.message, 'ok');
      if (apres) await apres(r);
      return r;
    } catch (e) { App.message(zoneMsg, App.erreurTexte(e), 'erreur', e.details); }
  }
  const bouton = (texte, fn, classe) => { const b = E('button', { type: 'button', class: classe || 'discret', texte }); b.addEventListener('click', fn); return b; };
  const tableau = (entetes, lignes) => {
    const t = E('table', {}, E('thead', {}, E('tr', {}, ...entetes.map((h) => E('th', { texte: h })))));
    const tb = E('tbody'); lignes.forEach((l) => tb.append(l)); t.append(tb);
    return E('div', { class: 'tableau-scroll' }, t);
  };
  const ligne = (...cells) => E('tr', {}, ...cells.map((c) => E('td', {}, c instanceof Node ? c : document.createTextNode(c == null ? '—' : String(c)))));

  /* ---------- tableau de bord ---------- */
  const NOMS_CHAINES = { CHAT_INTERACTIF: 'Chat interactif', WOUNANET: 'Wounanet', PREMIUM: 'Premium' };
  async function vueTableau(jours = 7) {
    const d = await App.api('GET', '/api/admin/tableau?jours=' + jours);
    zone.replaceChildren();
    const sel = E('select', { 'aria-label': 'Période' }, ...[1, 7, 30, 90].map((j) => E('option', { value: j, texte: j === 1 ? '24 heures' : j + ' jours' })));
    sel.value = String(d.jours === 1 ? 1 : d.jours);
    sel.addEventListener('change', () => vueTableau(Number(sel.value)).catch(erreur));
    zone.append(E('div', { class: 'rangee' }, E('strong', { texte: 'Activité des chaînes — période :' }), sel));
    const g = E('div', { class: 'stats' });
    Object.entries(d.chaines).forEach(([v, c]) => {
      const serie = d.courbe[v], max = Math.max(1, ...serie);
      const barres = E('div', { class: 'barres', role: 'img', 'aria-label': 'Activité quotidienne ' + (NOMS_CHAINES[v] || v) });
      serie.forEach((n, i) => { const s = E('span', { title: `${d.courbe.jours[i]} : ${n}` }); s.style.height = Math.round((n / max) * 100) + '%'; barres.append(s); });
      g.append(E('div', { class: 'carte stat' }, E('strong', { texte: NOMS_CHAINES[v] || v }), E('div', { class: 'n', texte: fmt(c.total) }),
        E('div', { class: 'indice', texte: `${fmt(c.visiteurs_distincts)} visiteurs distincts · ${fmt(c.dernieres_24h)} sur 24 h` }), barres,
        E('div', { class: 'indice', texte: Object.entries(c.par_type).map(([k, n]) => `${k} ${n}`).join(' · ') || 'Aucune activité' }),
        c.intentions.length ? E('div', { class: 'indice', texte: 'Intentions : ' + c.intentions.map((i) => `${i.intention} (${i.n})`).join(', ') }) : null));
    });
    zone.append(g);
    zone.append(E('div', { class: 'stats' },
      E('div', { class: 'carte stat' }, E('div', { class: 'indice', texte: 'Commandes en attente' }), E('div', { class: 'n', texte: fmt(d.commandes_en_attente) })),
      E('div', { class: 'carte stat' }, E('div', { class: 'indice', texte: 'Ventes validées (période)' }), E('div', { class: 'n', texte: fmt(d.ventes.chiffre_affaires_xaf) + ' FCFA' }),
        E('div', { class: 'indice', texte: d.ventes.commandes_validees + ' commandes' })),
      E('div', { class: 'carte stat' }, E('div', { class: 'indice', texte: 'Nouveaux comptes' }), E('div', { class: 'n', texte: fmt(d.nouveaux_utilisateurs) }),
        E('div', { class: 'indice', texte: Object.entries(d.utilisateurs).map(([r, n]) => `${r} ${n}`).join(' · ') }))));
    zone.append(E('h2', { texte: 'Derniers événements' }), tableau(['Date', 'Chaîne', 'Type', 'Intention', 'Mode', 'Compte', 'Détail'],
      d.derniers.map((x) => ligne(date(x.ts), NOMS_CHAINES[x.vitrine] || x.vitrine, x.type, x.intention, x.mode, x.pseudo || 'visiteur', x.detail))),
    E('p', { class: 'indice', texte: d.note }));
  }

  /* ---------- équipe ---------- */
  async function vueEquipe() {
    const d = await App.api('GET', '/api/admin/equipe');
    zone.replaceChildren();
    const form = E('form', { class: 'carte' }, E('h2', { texte: 'Créer un compte d’équipe' }), E('div', { class: 'grille-form' },
      E('div', {}, E('label', { for: 'eq-email', texte: 'E-mail' }), E('input', { id: 'eq-email', type: 'email', required: '', autocomplete: 'off' })),
      E('div', {}, E('label', { for: 'eq-role', texte: 'Rôle' }), E('select', { id: 'eq-role' }, E('option', { value: 'admin', texte: d.roles.admin.nom }), E('option', { value: 'technique', texte: d.roles.technique.nom }))),
      E('div', {}, E('label', { for: 'eq-charge', texte: 'Charge (facultatif)' }), E('input', { id: 'eq-charge', maxlength: '200' }))),
    E('div', { id: 'eq-role-desc', class: 'indice' }), E('div', { class: 'rangee' }, E('button', { type: 'submit', texte: 'Créer et inviter' })));
    const maj = () => { const r = d.roles[$('eq-role').value]; $('eq-role-desc').textContent = `Peut : ${r.peut.join(' ; ')}. Ne peut pas : ${r.ne_peut_pas.join(' ; ')}.`; };
    zone.append(form); $('eq-role').addEventListener('change', maj); maj();
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const r = await sensible('POST', '/api/admin/equipe', { email: $('eq-email').value, role: $('eq-role').value, charge: $('eq-charge').value }, async () => vueEquipe());
      if (r && r.lien_invitation) App.message(zoneMsg, (r.e_mail_envoye ? 'Invitation envoyée par e-mail. ' : 'E-mail non configuré : transmettez ce lien (72 h) en privé : ') + r.lien_invitation, 'ok');
    });
    zone.append(E('h2', { texte: 'Comptes de l’équipe' }), tableau(['Compte', 'Rôle', 'Charge', '2FA', 'Dernière connexion', 'Actions'], d.equipe.map((u) => {
      const act = E('div', { class: 'rangee' });
      if (u.role !== 'superadmin') {
        act.append(
          bouton(u.actif ? 'Suspendre' : 'Réactiver', () => sensible('PATCH', '/api/admin/equipe/' + u.id, { actif: !u.actif }, vueEquipe)),
          bouton('Réinit. 2FA', () => sensible('POST', `/api/admin/equipe/${u.id}/reinit-2fa`, {}, vueEquipe)),
          bouton('Nouvelle invitation', async () => { const r = await sensible('POST', `/api/admin/equipe/${u.id}/invitation`, {}); if (r) App.message(zoneMsg, 'Lien (72 h) : ' + r.lien_invitation, 'ok'); }),
          bouton('Supprimer', () => { if (confirm('Supprimer le compte ' + u.email + ' ?')) sensible('DELETE', '/api/admin/equipe/' + u.id, {}, vueEquipe); }, 'danger'));
      } else act.append(E('span', { class: 'indice', texte: 'Géré depuis le terminal' }));
      return ligne(`${u.pseudo} <${u.email}>`, d.roles[u.role].nom, u.charge, u.totp_actif ? 'activée' : 'à activer', date(u.derniere_connexion), act);
    })));
  }

  /* ---------- utilisateurs ---------- */
  async function vueUtilisateurs(q = '') {
    const d = await App.api('GET', '/api/admin/utilisateurs?q=' + encodeURIComponent(q));
    zone.replaceChildren();
    const champ = E('input', { type: 'search', placeholder: 'Rechercher e-mail ou pseudo', 'aria-label': 'Rechercher', value: q });
    const f = E('form', { class: 'rangee' }, champ, E('button', { type: 'submit', texte: 'Rechercher' }));
    f.addEventListener('submit', (e) => { e.preventDefault(); vueUtilisateurs(champ.value).catch(erreur); });
    zone.append(f, E('p', { class: 'indice', texte: fmt(d.total) + ' compte(s)' }));
    const action = (u, a, extra) => simple('POST', `/api/admin/utilisateurs/${u.id}/action`, { action: a, ...extra }, () => vueUtilisateurs(champ.value));
    zone.append(tableau(['Compte', 'Rôle', 'État', 'Premium jusqu’au', 'Actions'], d.utilisateurs.map((u) => {
      const act = E('div', { class: 'rangee' });
      act.append(bouton(u.actif ? 'Désactiver' : 'Activer', () => action(u, u.actif ? 'desactiver' : 'activer')));
      if (u.verrouille) act.append(bouton('Débloquer', () => action(u, 'debloquer')));
      if (!u.email_verifie) act.append(bouton('Valider e-mail', () => action(u, 'verifier_email')));
      if (perms.has('utilisateurs.premium')) {
        act.append(bouton('+30 j premium', () => action(u, 'accorder_premium', { jours: 30 })));
        if (u.role === 'premium') act.append(bouton('Retirer premium', () => action(u, 'retirer_premium'), 'danger'));
      }
      return ligne(`${u.pseudo} <${u.email}>`, u.role, [u.actif ? 'actif' : 'désactivé', u.verrouille ? 'verrouillé' : '', u.email_verifie ? '' : 'e-mail non vérifié'].filter(Boolean).join(', '),
        u.premium_jusqua ? date(u.premium_jusqua) : '—', act);
    })));
  }

  /* ---------- commandes ---------- */
  async function vueCommandes(statut = 'en_attente') {
    const d = await App.api('GET', '/api/admin/commandes?statut=' + statut);
    zone.replaceChildren();
    const sel = E('select', { 'aria-label': 'Statut' }, ...[['en_attente', 'En attente'], ['validee', 'Validées'], ['refusee', 'Refusées'], ['annulee', 'Annulées'], ['', 'Toutes']].map(([v, t]) => E('option', { value: v, texte: t })));
    sel.value = statut; sel.addEventListener('change', () => vueCommandes(sel.value).catch(erreur));
    zone.append(sel);
    if (!d.commandes.length) zone.append(E('p', { class: 'indice', texte: 'Aucune commande.' }));
    d.commandes.forEach((c) => {
      const b = E('div', { class: 'carte' }, E('div', { class: 'rangee' }, E('strong', { texte: c.reference }), E('span', { class: 'badge', texte: c.statut }),
        E('span', { class: 'indice', texte: `${c.client.pseudo} <${c.client.email}> · ${date(c.cree_le)} · ${c.mode_paiement || '—'}` })));
      c.lignes.forEach((l) => b.append(E('div', { class: 'indice', texte: `${l.quantite} × ${l.nom} — ${fmt(l.prix_unitaire)} FCFA` })));
      b.append(E('div', { class: 'prix', texte: 'Total ' + fmt(c.total_xaf) + ' FCFA' }));
      if (c.note) b.append(E('p', { class: 'indice', texte: 'Note : ' + c.note }));
      if (c.statut === 'en_attente' && perms.has('commandes.valider')) {
        b.append(E('div', { class: 'rangee' },
          bouton('Valider (paiement reçu)', () => { if (confirm('Confirmer la réception du paiement de ' + c.reference + ' ?')) simple('POST', `/api/admin/commandes/${c.id}/valider`, {}, () => vueCommandes(sel.value)); }, 'bouton'),
          bouton('Refuser', () => simple('POST', `/api/admin/commandes/${c.id}/refuser`, {}, () => vueCommandes(sel.value)), 'danger')));
      }
      zone.append(b);
    });
  }

  /* ---------- catalogue et prix ---------- */
  async function vueCatalogue() {
    const d = await App.api('GET', '/api/admin/produits');
    const peutGerer = perms.has('catalogue.gerer'), peutPrix = perms.has('catalogue.prix');
    zone.replaceChildren();
    if (peutGerer) {
      const f = E('form', { class: 'carte' }, E('h2', { texte: 'Nouveau produit' }), E('div', { class: 'grille-form' },
        E('div', {}, E('label', { for: 'p-nom', texte: 'Nom' }), E('input', { id: 'p-nom', required: '', maxlength: '120' })),
        E('div', {}, E('label', { for: 'p-cat', texte: 'Catégorie' }), E('input', { id: 'p-cat', value: 'Services', maxlength: '60' })),
        E('div', {}, E('label', { for: 'p-type', texte: 'Type' }), E('select', { id: 'p-type' }, ...['service', 'abonnement', 'logiciel'].map((t) => E('option', { value: t, texte: t })))),
        E('div', {}, E('label', { for: 'p-duree', texte: 'Durée (jours, abonnement)' }), E('input', { id: 'p-duree', type: 'number', min: '1' })),
        E('div', {}, E('label', { for: 'p-prix', texte: 'Prix FCFA (vide = tarif à venir)' }), E('input', { id: 'p-prix', type: 'number', min: '0' }))),
      E('label', { for: 'p-desc', texte: 'Description courte' }), E('input', { id: 'p-desc', required: '', maxlength: '400' }),
      E('label', { for: 'p-det', texte: 'Détails' }), E('textarea', { id: 'p-det', maxlength: '3000' }),
      E('div', { class: 'rangee' }, E('button', { type: 'submit', texte: 'Créer le produit' })));
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const prix = $('p-prix').value === '' ? null : Number($('p-prix').value);
        const duree = $('p-duree').value === '' ? null : Number($('p-duree').value);
        const corps = { nom: $('p-nom').value, categorie: $('p-cat').value, type: $('p-type').value, duree_jours: duree, prix_xaf: prix, description: $('p-desc').value, details: $('p-det').value };
        if (prix !== null) await sensible('POST', '/api/admin/produits', corps, vueCatalogue); else await simple('POST', '/api/admin/produits', corps, vueCatalogue);
      });
      zone.append(f);
    }
    zone.append(E('h2', { texte: 'Produits' }), tableau(['Produit', 'Type', 'Prix (FCFA)', 'Visible', 'Actions'], d.produits.map((p) => {
      const act = E('div', { class: 'rangee' });
      if (peutPrix) act.append(bouton('Modifier le prix', async () => {
        const saisie = prompt('Nouveau prix en FCFA (laisser vide = « tarif à venir ») :', p.prix_xaf == null ? '' : String(p.prix_xaf));
        if (saisie === null) return;
        const v = saisie.trim() === '' ? null : Number(saisie);
        if (v !== null && (!Number.isInteger(v) || v < 0)) { App.message(zoneMsg, 'Prix invalide.'); return; }
        await sensible('PATCH', '/api/admin/produits/' + p.id, { prix_xaf: v }, vueCatalogue);
      }));
      if (peutGerer) {
        act.append(bouton(p.actif ? 'Masquer' : 'Afficher', () => simple('PATCH', '/api/admin/produits/' + p.id, { actif: !p.actif }, vueCatalogue)),
          bouton('Supprimer', () => { if (confirm('Supprimer « ' + p.nom + ' » ?')) sensible('DELETE', '/api/admin/produits/' + p.id, {}, vueCatalogue); }, 'danger'));
      }
      return ligne(p.nom, p.type + (p.duree_jours ? ` · ${p.duree_jours} j` : ''), p.prix_xaf == null ? 'à venir' : fmt(p.prix_xaf), p.actif ? 'oui' : 'non', act);
    })));
  }

  /* ---------- logiciels ---------- */
  async function vueLogiciels() {
    const [d, prod] = await Promise.all([App.api('GET', '/api/admin/logiciels'), App.api('GET', '/api/admin/produits')]);
    zone.replaceChildren();
    const logiciels = prod.produits.filter((p) => p.type === 'logiciel');
    const f = E('form', { class: 'carte' }, E('h2', { texte: 'Publier une version' }), E('div', { class: 'grille-form' },
      E('div', {}, E('label', { for: 'l-prod', texte: 'Produit (type logiciel)' }), E('select', { id: 'l-prod', required: '' }, ...logiciels.map((p) => E('option', { value: p.id, texte: p.nom })))),
      E('div', {}, E('label', { for: 'l-ver', texte: 'Version' }), E('input', { id: 'l-ver', required: '', maxlength: '40' })),
      E('div', {}, E('label', { for: 'l-plat', texte: 'Plateforme' }), E('select', { id: 'l-plat' }, ...d.plateformes.map((p) => E('option', { value: p, texte: p })))),
      E('div', {}, E('label', { for: 'l-fic', texte: `Fichier (max ${d.taille_max_mo} Mo)` }), E('input', { id: 'l-fic', type: 'file', required: '' }))),
    E('label', { for: 'l-notes', texte: 'Notes de version' }), E('textarea', { id: 'l-notes', maxlength: '1000' }),
    E('label', {}, E('input', { id: 'l-pub', type: 'checkbox', style: 'width:auto' }), ' Publier immédiatement'),
    E('div', { class: 'rangee' }, E('button', { type: 'submit', texte: 'Téléverser' })));
    if (!logiciels.length) f.append(E('p', { class: 'indice', texte: 'Créez d’abord un produit de type « logiciel » dans le catalogue.' }));
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = await demanderCode(); if (!code) return;
      const fd = new FormData();
      fd.append('produit_id', $('l-prod').value); fd.append('version', $('l-ver').value); fd.append('plateforme', $('l-plat').value);
      fd.append('notes', $('l-notes').value); fd.append('publie', $('l-pub').checked ? '1' : '0'); fd.append('code_totp', code);
      fd.append('fichier', $('l-fic').files[0]);
      try {
        const rep = await fetch('/api/admin/logiciels', { method: 'POST', body: fd, credentials: 'same-origin', headers: { 'X-CSRF-Token': App.csrf } });
        const data = await rep.json().catch(() => ({}));
        if (!rep.ok) throw { statut: rep.status, ...data };
        App.message(zoneMsg, 'Version téléversée (SHA-256 ' + data.logiciel.sha256.slice(0, 16) + '…).', 'ok'); vueLogiciels();
      } catch (er) { App.message(zoneMsg, App.erreurTexte(er)); }
    });
    zone.append(f, E('h2', { texte: 'Versions' }), tableau(['Produit', 'Version', 'Plateforme', 'Taille', 'Téléch.', 'État', 'Actions'], d.logiciels.map((l) => ligne(
      l.produit, l.version, l.plateforme, (l.taille / 1048576).toFixed(1) + ' Mo', l.telechargements, l.publie ? 'publiée' : 'brouillon',
      E('div', { class: 'rangee' },
        bouton(l.publie ? 'Retirer' : 'Publier', () => sensible('PATCH', '/api/admin/logiciels/' + l.id, { publie: !l.publie }, vueLogiciels)),
        bouton('Supprimer', () => { if (confirm('Supprimer cette version ?')) sensible('DELETE', '/api/admin/logiciels/' + l.id, {}, vueLogiciels); }, 'danger'))))));
  }

  /* ---------- paiement ---------- */
  async function vuePaiement() {
    const d = await App.api('GET', '/api/admin/parametres/paiement');
    zone.replaceChildren();
    const ta = E('textarea', { id: 'pay', rows: '6', maxlength: '2000' }); ta.value = d.instructions || '';
    const f = E('form', { class: 'carte' }, E('h2', { texte: 'Instructions de paiement affichées au client' }),
      E('p', { class: 'indice', texte: 'Numéros Mobile Money, RIB, etc. Le paiement n’est pas automatisé : vous validez chaque commande à réception.' }), ta,
      E('div', { class: 'rangee' }, E('button', { type: 'submit', texte: 'Enregistrer' })));
    f.addEventListener('submit', (e) => { e.preventDefault(); sensible('PUT', '/api/admin/parametres/paiement', { instructions: ta.value }); });
    zone.append(f);
  }

  /* ---------- système ---------- */
  async function vueSysteme() {
    const d = await App.api('GET', '/api/admin/etat');
    zone.replaceChildren();
    const rows = [['Version', d.version], ['Environnement', d.environnement], ['Adresse', d.adresse], ['Démarré le', d.demarre_le], ['Moteur IA configuré', d.moteur_configure ? 'oui' : 'non'],
      ['SMTP configuré', d.smtp_configure ? 'oui' : 'non'], ['Base de données', d.taille_base_mo + ' Mo'], ['Sessions actives', d.sessions_actives], ['Wounanet', JSON.stringify(d.wounanet)]];
    zone.append(tableau(['Élément', 'Valeur'], rows.map(([a, b]) => ligne(a, b))));
    if (perms.has('systeme.maintenance')) {
      zone.append(E('div', { class: 'rangee' }, bouton('Purger les données périmées', () => simple('POST', '/api/admin/maintenance/purger', {}), 'bouton'),
        bouton('Relancer la collecte Wounanet', () => simple('POST', '/api/admin/maintenance/wounanet', {}, (r) => App.message(zoneMsg, r.depeches_collectees + ' dépêches collectées.', 'ok')))));
    }
  }

  /* ---------- audit ---------- */
  async function vueAudit() {
    const d = await App.api('GET', '/api/admin/audit?limite=200');
    zone.replaceChildren(E('p', { class: 'indice', texte: d.portee === 'tout' ? 'Journal complet.' : 'Vos propres actions uniquement.' }),
      tableau(['Date', 'Événement', 'Compte', 'IP', 'Détail'], d.evenements.map((x) => ligne(date(x.ts), x.evenement, x.pseudo, x.ip, x.detail))));
  }

  const ONGLETS = [
    ['tableau', 'Activité', 'activite.toutes', () => vueTableau()], ['equipe', 'Équipe', 'staff.gerer', vueEquipe],
    ['utilisateurs', 'Utilisateurs', 'utilisateurs.lire', () => vueUtilisateurs()], ['commandes', 'Commandes', 'commandes.lire', () => vueCommandes()],
    ['catalogue', 'Catalogue & prix', 'catalogue.lire', vueCatalogue], ['logiciels', 'Logiciels', 'logiciels.publier', vueLogiciels],
    ['paiement', 'Paiement', 'parametres.paiement', vuePaiement], ['systeme', 'Système', 'systeme.etat', vueSysteme], ['audit', 'Audit', null, vueAudit],
  ];
  const erreur = (e) => App.message(zoneMsg, App.erreurTexte(e), 'erreur');

  function ouvrir(id) {
    const onglet = ONGLETS.find((o) => o[0] === id);
    document.querySelectorAll('#onglets-admin button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.id === id)));
    zoneMsg.replaceChildren(); zone.replaceChildren(E('p', { class: 'indice', texte: 'Chargement…' }));
    onglet[3]().catch(erreur);
  }

  async function init() {
    const u = await App.charger();
    if (!u || !['technique', 'admin', 'superadmin'].includes(u.role)) {
      $('identite-admin').textContent = '';
      zone.append(E('div', { class: 'carte' }, E('p', { texte: 'Cette section est réservée à l’équipe TOMTECH.INC.' }), E('a', { class: 'bouton', href: '/connexion', texte: 'Connexion' })));
      return;
    }
    try {
      const m = await App.api('GET', '/api/admin/moi');
      perms = new Set(m.permissions);
      $('identite-admin').textContent = `${m.nom} — ${m.charge}`;
    } catch (e) { erreur(e); return; }
    const nav = $('onglets-admin');
    ONGLETS.filter((o) => !o[2] || perms.has(o[2])).forEach((o) => {
      const b = E('button', { type: 'button', 'data-id': o[0], 'aria-selected': 'false', texte: o[1] });
      b.addEventListener('click', () => { location.hash = o[0]; });
      nav.append(b);
    });
    const dispo = [...nav.children].map((b) => b.dataset.id);
    const go = () => ouvrir(dispo.includes(location.hash.slice(1)) ? location.hash.slice(1) : dispo[0]);
    window.addEventListener('hashchange', go); go();
  }
  init();
})();
