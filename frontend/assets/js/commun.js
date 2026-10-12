'use strict';
/* Utilitaires partagés : appels API (CSRF), navigation, rendu sûr du texte (jamais d'innerHTML). */
const App = {
  csrf: null,
  user: null,

  async api(methode, url, corps) {
    const entetes = { Accept: 'application/json' };
    if (corps !== undefined) entetes['Content-Type'] = 'application/json';
    if (this.csrf && methode !== 'GET') entetes['X-CSRF-Token'] = this.csrf;
    let rep;
    try {
      rep = await fetch(url, {
        method: methode, headers: entetes, credentials: 'same-origin',
        body: corps !== undefined ? JSON.stringify(corps) : undefined,
      });
    } catch (e) {
      throw { statut: 0, erreur: 'Serveur injoignable. Vérifiez votre connexion.' };
    }
    let data = {};
    try { data = await rep.json(); } catch (e) { /* corps vide */ }
    if (!rep.ok) throw { statut: rep.status, ...data };
    return data;
  },

  async charger() {
    try {
      const d = await this.api('GET', '/api/auth/moi');
      this.user = d.utilisateur; this.csrf = d.csrf || null;
    } catch (e) { this.user = null; }
    this.monterNav();
    return this.user;
  },

  el(tag, attrs, ...enfants) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === 'class') n.className = v; else if (k === 'texte') n.textContent = v; else n.setAttribute(k, v);
    }
    for (const e of enfants) if (e != null) n.append(e);
    return n;
  },

  monterNav() {
    const cible = document.getElementById('entete');
    if (!cible) return;
    const page = location.pathname;
    cible.replaceChildren();
    cible.append(this.el('a', { class: 'logo', href: '/' }, 'PEGINTI ', this.el('span', { texte: 'IA' })));
    const nav = this.el('nav', { 'aria-label': 'Navigation principale' });
    const liens = [['/', 'Chat'], ['/wounanet', 'Wounanet'], ['/premium', 'Boutique']];
    if (this.user && ['technique', 'admin', 'superadmin'].includes(this.user.role)) liens.push(['/admin', 'Admin']);
    this.monterNavBas(liens);
    for (const [href, nom] of liens) {
      const a = this.el('a', { href, texte: nom });
      if (page === href) a.setAttribute('aria-current', 'page');
      nav.append(a);
    }
    cible.append(nav);
    const zone = this.el('div', { class: 'compte' });
    if (this.user) {
      zone.append(this.el('a', { href: '/compte', texte: this.user.pseudo }));
      const b = this.el('button', { class: 'discret', type: 'button', texte: 'Quitter' });
      b.addEventListener('click', async () => {
        try { await this.api('POST', '/api/auth/deconnexion', {}); } catch (e) { /* ignore */ }
        location.href = '/';
      });
      zone.append(b);
    } else {
      zone.append(this.el('a', { class: 'bouton', href: '/connexion', texte: 'Connexion' }));
    }
    cible.append(zone);
  },

  monterNavBas(liens) {
    const bas = document.getElementById('nav-bas');
    if (!bas) return;
    const icones = { '/': '💬', '/wounanet': '📡', '/premium': '🛒', '/admin': '⚙️', '/compte': '👤', '/connexion': '👤' };
    const tous = [...liens, this.user ? ['/compte', 'Compte'] : ['/connexion', 'Connexion']];
    bas.replaceChildren();
    for (const [href, nom] of tous) {
      const a = this.el('a', { href }, this.el('span', { 'aria-hidden': 'true', texte: icones[href] || '•' }), this.el('small', { texte: nom }));
      if (location.pathname === href) a.setAttribute('aria-current', 'page');
      bas.append(a);
    }
  },

  message(conteneur, texte, type = 'erreur', details) {
    const m = this.el('div', { class: 'msg ' + type, role: type === 'erreur' ? 'alert' : 'status' }, texte);
    if (details && details.length) {
      const ul = this.el('ul');
      details.forEach((d) => ul.append(this.el('li', { texte: d })));
      m.append(ul);
    }
    conteneur.replaceChildren(m);
  },

  /* Texte → DOM : paragraphes + blocs de code ```…```. Tout passe par textContent. */
  rendreTexte(conteneur, texte) {
    String(texte).split(/```/).forEach((morceau, i) => {
      if (i % 2 === 1) {
        const code = morceau.replace(/^[a-zA-Z0-9+#-]*\n/, '');
        conteneur.append(this.el('pre', {}, this.el('code', { texte: code.replace(/\n$/, '') })));
      } else {
        morceau.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
          .forEach((p) => conteneur.append(this.el('p', { texte: p })));
      }
    });
  },

  lienSur(url) {
    try { const u = new URL(url); return (u.protocol === 'https:' || u.protocol === 'http:') ? u.href : null; }
    catch (e) { return null; }
  },

  carteSource(s) {
    const href = this.lienSur(s.lien);
    const titre = href
      ? this.el('a', { href, target: '_blank', rel: 'noopener noreferrer nofollow', texte: s.titre })
      : this.el('strong', { texte: s.titre });
    const date = s.date ? new Date(s.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : 'date inconnue';
    return this.el('div', { class: 'source' }, titre,
      this.el('div', { class: 'meta', texte: `${s.source} · ${date}` }),
      s.resume ? this.el('div', { texte: s.resume }) : null);
  },

  erreurTexte(e) { return e && e.erreur ? e.erreur : 'Une erreur est survenue.'; },
};

/* PWA : service worker et bouton « Installer l'application » (Android, Chrome/Edge PC). */
if ('serviceWorker' in navigator) window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
window.addEventListener('beforeinstallprompt', (ev) => {
  ev.preventDefault();
  const zone = document.querySelector('.compte');
  if (!zone || document.getElementById('btn-installer')) return;
  const b = App.el('button', { type: 'button', id: 'btn-installer', class: 'discret', texte: 'Installer l’app' });
  b.addEventListener('click', async () => { ev.prompt(); try { await ev.userChoice; } catch (e) { /* ignore */ } b.remove(); });
  zone.prepend(b);
});
