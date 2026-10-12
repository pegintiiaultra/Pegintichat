'use strict';
/* Vitrine CHAT INTERACTIF (publique) et studio premium : même interface, endpoint différent. */
(function () {
  const fil = document.getElementById('fil');
  const form = document.getElementById('form-chat');
  const champ = document.getElementById('message');
  const zoneMsg = document.getElementById('zone-msg');
  const endpoint = fil.dataset.endpoint;
  const vitrine = fil.dataset.vitrine;
  const historique = [];

  function bulle(role, rep) {
    const b = App.el('div', { class: 'bulle' + (role === 'user' ? ' moi' : '') });
    if (rep && rep.sections && rep.sections.length) {
      rep.sections.forEach((s) => {
        b.append(App.el('div', { class: 'titre-section', texte: s.titre }));
        App.rendreTexte(b, s.texte);
      });
    } else {
      App.rendreTexte(b, typeof rep === 'string' ? rep : rep.texte);
    }
    if (rep && rep.sources && rep.sources.length) {
      const s = App.el('div', { class: 'sources' });
      rep.sources.forEach((x) => s.append(App.carteSource(x)));
      b.append(s);
    }
    fil.append(b);
    fil.scrollTop = fil.scrollHeight;
  }

  async function init() {
    await App.charger();
    if (endpoint === '/api/premium/studio' && App.user && ['premium', 'technique', 'admin', 'superadmin'].includes(App.user.role)) {
      document.getElementById('studio').classList.remove('cache');
      document.getElementById('studio-verrou').classList.add('cache');
    }
    if (App.user && !fil.dataset.sansHistorique) {
      try {
        const h = await App.api('GET', '/api/historique?vitrine=' + vitrine);
        h.messages.forEach((m) => bulle(m.role, m.contenu));
      } catch (e) { /* historique facultatif */ }
    }
    const effacer = document.getElementById('effacer');
    if (effacer) effacer.addEventListener('click', async () => {
      if (App.user) { try { await App.api('DELETE', '/api/historique?vitrine=' + vitrine); } catch (e) { /* ignore */ } }
      fil.replaceChildren(); historique.length = 0;
    });
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const texte = champ.value.trim();
    if (!texte) return;
    zoneMsg.replaceChildren();
    bulle('user', texte);
    champ.value = '';
    const bouton = form.querySelector('button[type=submit]');
    bouton.disabled = true;
    try {
      const corps = { message: texte };
      if (!App.user) corps.historique = historique.slice(-6);
      const rep = await App.api('POST', endpoint, corps);
      bulle('assistant', rep);
      historique.push({ role: 'user', contenu: texte }, { role: 'assistant', contenu: rep.texte });
    } catch (e) {
      App.message(zoneMsg, App.erreurTexte(e));
    } finally { bouton.disabled = false; champ.focus(); }
  });

  champ.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); form.requestSubmit(); }
  });
  init();
})();
