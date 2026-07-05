'use strict';

const intentions = require('../moteur/intentions');

function raisonner(sujet, contexte = {}) {
  const intention = intentions.detecterIntention(sujet);

  const reponse = `Sujet : ${sujet}\nIntention détectée : ${intention.type}`;

  const developpement = `
Analyse contextuelle :
- Intention : ${intention.type} (confiance ${intention.confiance})
- Module trouvé : ${contexte.module ? contexte.module.module : 'aucun'}
- Mémoire : ${Array.isArray(contexte.memoire) ? contexte.memoire.length : 0} entrées
- Actualités : ${contexte.actualites && contexte.actualites.total ? contexte.actualites.total : 0} articles

Dialectique :
1. Thèse → ${sujet}
2. Antithèse → Opposition ou critique implicite
3. Synthèse → Proposition souveraine adaptée
  `.trim();

  const conclusion = `
Cette matrice souveraine propose une narration complète (intro, développement, conclusion) adaptée au sujet "${sujet}".
  `.trim();

  return { reponse, developpement, conclusion };
}

module.exports = { raisonner };
