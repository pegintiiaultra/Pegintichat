'use strict';
/* Espace compte : profil, mot de passe, double authentification, sessions, suppression. */
(function () {
  const zoneMsg = document.getElementById('zone-msg');

  async function action(ev, fn) {
    ev.preventDefault();
    const b = ev.target.querySelector('button[type=submit]');
    if (b) b.disabled = true; zoneMsg.replaceChildren();
    try { await fn(); } catch (e) { App.message(zoneMsg, App.erreurTexte(e), 'erreur', e.details); }
    finally { if (b) b.disabled = false; }
  }
  const val = (id) => document.getElementById(id).value;

  function profil() {
    const u = App.user;
    document.getElementById('p-pseudo').textContent = u.pseudo;
    document.getElementById('p-email').textContent = u.email;
    document.getElementById('p-role').textContent = u.role;
    document.getElementById('p-verif').textContent = u.email_verifie ? 'vérifiée' : 'non vérifiée';
    document.getElementById('tfa-off').classList.toggle('cache', u.totp_actif);
    document.getElementById('tfa-on').classList.toggle('cache', !u.totp_actif);
    document.getElementById('tfa-obligatoire').classList.toggle('cache', !(u.double_auth_obligatoire && !u.totp_actif));
    document.getElementById('tfa-off-bloc').classList.toggle('cache', !!u.double_auth_obligatoire);
    document.getElementById('codes-restants').textContent = String(u.codes_secours_restants ?? 0);
  }

  async function sessions() {
    const d = await App.api('GET', '/api/auth/sessions');
    const t = document.getElementById('table-sessions');
    t.replaceChildren(App.el('tr', {}, ...['Appareil', 'IP', 'Dernière activité', ''].map((x) => App.el('th', { texte: x }))));
    d.sessions.forEach((s) => {
      const tr = App.el('tr', {}, App.el('td', { texte: (s.agent || 'inconnu').slice(0, 60) + (s.courante ? ' (cette session)' : '') }),
        App.el('td', { texte: s.ip || '' }), App.el('td', { texte: new Date(s.derniere_activite * 1000).toLocaleString('fr-FR') }));
      const td = App.el('td');
      if (!s.courante) {
        const b = App.el('button', { type: 'button', class: 'discret', texte: 'Fermer' });
        b.addEventListener('click', async () => { await App.api('DELETE', '/api/auth/sessions/' + s.id); sessions(); });
        td.append(b);
      }
      tr.append(td); t.append(tr);
    });
  }

  document.getElementById('form-mdp').addEventListener('submit', (ev) => action(ev, async () => {
    const r = await App.api('POST', '/api/auth/mot-de-passe', { actuel: val('mdp-actuel'), nouveau: val('mdp-nouveau') });
    ev.target.reset(); App.message(zoneMsg, r.message, 'ok'); sessions();
  }));

  document.getElementById('tfa-demarrer').addEventListener('click', (ev) => action(ev, async () => {
    const r = await App.api('POST', '/api/auth/2fa/initier', {});
    document.getElementById('tfa-secret').textContent = r.secret.match(/.{1,4}/g).join(' ');
    document.getElementById('tfa-uri').textContent = r.uri;
    document.getElementById('tfa-config').classList.remove('cache');
  }));
  document.getElementById('form-tfa-activer').addEventListener('submit', (ev) => action(ev, async () => {
    const r = await App.api('POST', '/api/auth/2fa/activer', { code: val('tfa-code') });
    App.user.totp_actif = true; App.user.codes_secours_restants = (r.codes_secours || []).length; profil();
    document.getElementById('tfa-config').classList.add('cache');
    montrerCodes(r.codes_secours);
    App.message(zoneMsg, r.message, 'ok');
  }));
  function montrerCodes(codes) {
    document.getElementById('codes-liste').textContent = (codes || []).join('   ');
    document.getElementById('codes-bloc').classList.toggle('cache', !(codes && codes.length));
  }
  document.getElementById('form-codes').addEventListener('submit', (ev) => action(ev, async () => {
    const r = await App.api('POST', '/api/auth/2fa/codes-secours', { mot_de_passe: val('codes-mdp'), code: val('codes-code') });
    ev.target.reset(); App.user.codes_secours_restants = (r.codes_secours || []).length; profil(); montrerCodes(r.codes_secours);
    App.message(zoneMsg, r.message || 'Nouveaux codes générés : les anciens sont invalides.', 'ok');
  }));
  document.getElementById('form-tfa-off').addEventListener('submit', (ev) => action(ev, async () => {
    const r = await App.api('POST', '/api/auth/2fa/desactiver', { mot_de_passe: val('tfa-off-mdp'), code: val('tfa-off-code') });
    App.user.totp_actif = false; profil(); ev.target.reset(); App.message(zoneMsg, r.message, 'ok');
  }));

  document.getElementById('toutes').addEventListener('click', (ev) => action(ev, async () => {
    await App.api('POST', '/api/auth/deconnexion-toutes', {}); location.href = '/connexion';
  }));
  document.getElementById('form-suppr').addEventListener('submit', (ev) => action(ev, async () => {
    if (!confirm('Supprimer définitivement votre compte et toutes vos données ?')) return;
    await App.api('DELETE', '/api/auth/compte', { mot_de_passe: val('suppr-mdp') }); location.href = '/';
  }));

  App.charger().then((u) => { if (!u) { location.href = '/connexion?retour=/compte'; return; } profil(); sessions(); });
})();
