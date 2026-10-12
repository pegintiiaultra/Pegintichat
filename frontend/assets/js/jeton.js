'use strict';
/* Pages de lien e-mail : confirmation d'adresse et réinitialisation du mot de passe. */
(function () {
  const p = new URLSearchParams(location.search);
  const type = p.get('type'), jeton = p.get('jeton');
  history.replaceState(null, '', location.pathname);  // le jeton ne reste pas dans l'historique/la barre d'adresse
  const zoneMsg = document.getElementById('zone-msg');
  const form = document.getElementById('form-reset');
  App.charger();

  if (!jeton || !['verif', 'reset'].includes(type)) {
    App.message(zoneMsg, 'Lien invalide.');
  } else if (type === 'verif') {
    document.getElementById('titre').textContent = 'Confirmation de l’adresse e-mail';
    App.api('POST', '/api/auth/verifier-email', { jeton })
      .then((r) => App.message(zoneMsg, r.message, 'ok'))
      .catch((e) => App.message(zoneMsg, App.erreurTexte(e)));
  } else {
    document.getElementById('titre').textContent = 'Nouveau mot de passe';
    form.classList.remove('cache');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const b = form.querySelector('button[type=submit]'); b.disabled = true;
      try {
        const r = await App.api('POST', '/api/auth/reinitialiser', { jeton, mot_de_passe: document.getElementById('nv-mdp').value });
        form.classList.add('cache'); App.message(zoneMsg, r.message, 'ok');
      } catch (e) { App.message(zoneMsg, App.erreurTexte(e), 'erreur', e.details); }
      finally { b.disabled = false; }
    });
  }
})();
