'use strict';
/* Connexion, inscription, mot de passe oublié. La politique de mot de passe affichée est indicative ;
   le serveur reste l'autorité. */
(function () {
  const zoneMsg = document.getElementById('zone-msg');
  const panneaux = { connexion: document.getElementById('p-connexion'), inscription: document.getElementById('p-inscription'), oubli: document.getElementById('p-oubli') };
  const onglets = document.querySelectorAll('[data-onglet]');

  function montrer(nom) {
    Object.entries(panneaux).forEach(([k, p]) => p.classList.toggle('cache', k !== nom));
    onglets.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.onglet === nom)));
    zoneMsg.replaceChildren();
  }
  onglets.forEach((b) => b.addEventListener('click', () => montrer(b.dataset.onglet)));
  document.getElementById('lien-oubli').addEventListener('click', () => montrer('oubli'));

  // --- indicateur de robustesse
  const regles = [
    ['12 caractères minimum', (m) => m.length >= 12],
    ['Minuscule et majuscule', (m) => /[a-z]/.test(m) && /[A-Z]/.test(m)],
    ['Un chiffre', (m) => /\d/.test(m)],
    ['Un symbole', (m) => /[^\w\s]|_/.test(m)],
  ];
  const liste = document.getElementById('regles');
  regles.forEach(([t]) => liste.append(App.el('li', { texte: t })));
  document.getElementById('ins-mdp').addEventListener('input', (e) => {
    [...liste.children].forEach((li, i) => li.classList.toggle('ok', regles[i][1](e.target.value)));
  });

  async function envoyer(ev, url, corps, surSucces) {
    ev.preventDefault();
    const b = ev.target.querySelector('button[type=submit]');
    b.disabled = true; zoneMsg.replaceChildren();
    try { await surSucces(await App.api('POST', url, corps())); }
    catch (e) { return e; }
    finally { b.disabled = false; }
  }

  document.getElementById('form-connexion').addEventListener('submit', async (ev) => {
    const champTotp = document.getElementById('totp-bloc');
    const e = await envoyer(ev, '/api/auth/connexion', () => {
      const c = { email: document.getElementById('log-email').value, mot_de_passe: document.getElementById('log-mdp').value };
      const code = document.getElementById('log-totp').value.trim();
      if (code) c.code_totp = code;
      const sec = document.getElementById('log-secours').value.trim();
      if (sec && !code) c.code_secours = sec;
      return c;
    }, () => { const r = new URLSearchParams(location.search).get('retour'); location.href = r && r.startsWith('/') && !r.startsWith('//') ? r : '/compte'; });
    if (!e) return;
    if (e.code === 'totp_requis') { champTotp.classList.remove('cache'); document.getElementById('log-totp').focus(); App.message(zoneMsg, 'Saisissez le code de votre application d’authentification.', 'ok'); }
    else App.message(zoneMsg, App.erreurTexte(e), 'erreur', e.details);
  });

  document.getElementById('form-inscription').addEventListener('submit', async (ev) => {
    const e = await envoyer(ev, '/api/auth/inscription', () => ({
      email: document.getElementById('ins-email').value, pseudo: document.getElementById('ins-pseudo').value,
      mot_de_passe: document.getElementById('ins-mdp').value,
    }), (r) => { App.message(zoneMsg, r.message, 'ok'); ev.target.reset(); montrer('connexion'); App.message(zoneMsg, r.message, 'ok'); });
    if (e) App.message(zoneMsg, App.erreurTexte(e), 'erreur', e.details);
  });

  document.getElementById('form-oubli').addEventListener('submit', async (ev) => {
    const e = await envoyer(ev, '/api/auth/mot-de-passe-oublie', () => ({ email: document.getElementById('oubli-email').value }),
      (r) => App.message(zoneMsg, r.message, 'ok'));
    if (e) App.message(zoneMsg, App.erreurTexte(e));
  });

  App.charger().then((u) => { if (u) location.href = '/compte'; });
})();
