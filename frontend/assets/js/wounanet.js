'use strict';
/* Vitrine WOUNANET : veille et recherche en temps réel (compte requis). */
(function () {
  const verrou = document.getElementById('verrou');
  const formulaire = document.getElementById('form-recherche');
  const resultat = document.getElementById('resultat');
  const flux = document.getElementById('flux');
  const zoneMsg = document.getElementById('zone-msg');

  function afficher(rep) {
    resultat.replaceChildren();
    const carte = App.el('div', { class: 'carte' });
    if (rep.note) carte.append(App.el('p', { class: 'indice', texte: rep.note }));
    if (rep.sections && rep.sections.length) {
      rep.sections.forEach((s) => {
        carte.append(App.el('h2', { texte: s.titre }));
        App.rendreTexte(carte, s.texte);
      });
    } else { App.rendreTexte(carte, rep.texte); }
    resultat.append(carte);
    if (rep.sources.length) {
      const g = App.el('div', { class: 'sources' });
      rep.sources.forEach((s) => g.append(App.carteSource(s)));
      resultat.append(App.el('h2', { texte: 'Sources' }), g);
    }
  }

  async function init() {
    await App.charger();
    if (App.user) { verrou.classList.add('cache'); formulaire.classList.remove('cache'); }
    try {
      const d = await App.api('GET', '/api/wounanet/actualites');
      if (!d.depeches.length) {
        flux.append(App.el('p', { class: 'indice', texte: 'Aucune dépêche collectée pour le moment (sources injoignables ou premier balayage en cours).' }));
      }
      d.depeches.forEach((s) => flux.append(App.carteSource(s)));
    } catch (e) { App.message(zoneMsg, App.erreurTexte(e)); }
  }

  document.getElementById('form-recherche').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const sujet = document.getElementById('sujet').value.trim();
    if (sujet.length < 2) return;
    const b = ev.target.querySelector('button[type=submit]');
    b.disabled = true; zoneMsg.replaceChildren();
    resultat.replaceChildren(App.el('p', { class: 'indice', texte: 'Balayage en cours…' }));
    try { afficher(await App.api('POST', '/api/wounanet/rechercher', { sujet })); }
    catch (e) { resultat.replaceChildren(); App.message(zoneMsg, App.erreurTexte(e)); }
    finally { b.disabled = false; }
  });
  init();
})();
