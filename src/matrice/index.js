'use strict';

const bip = require('./bip');

/* =========================
   HERMÉNEUTIQUE
========================= */
function hermeneutique(sujet) {
  const texte = String(sujet || '').trim();

  return `
Il faut noter que ${texte} s’inscrit dans une lecture historique où les peuples ont toujours cherché à maîtriser leurs moyens d’expression et de communication.

Ensuite, dans le présent, ${texte} devient un enjeu vital : protéger les données, garantir l’indépendance des infrastructures et affirmer une identité face aux puissances extérieures.

Enfin, l’herméneutique nous invite à transposer cette réflexion vers l’avenir : ${texte} n’est pas seulement une défense, mais une projection. Elle ouvre la voie à une vision souveraine où chaque nation peut bâtir ses propres protocoles et inscrire son autonomie dans l’univers digital.
`;
}

/* =========================
   SCANNER
========================= */
async function scanner(sujet) {
  return { sujet, original: sujet, narration: hermeneutique(sujet) };
}

/* =========================
   FINALISER
========================= */
async function finaliser(intention, donnees) {
  let texte = '';

  if (donnees.modules?.length) {
    texte += `Les modules actifs ont enrichi la réflexion sur "${intention.sujet}".\n\n`;
  } else if (donnees.memoire?.matches?.length) {
    texte += `La mémoire a rappelé des correspondances utiles liées à "${intention.sujet}".\n\n`;
  } else if (donnees.wounanet) {
    texte += `Une recherche Wounanet a été déclenchée sur "${intention.sujet}".\n\n`;
  }

  texte += intention.narration;

  return texte.trim();
}

/* =========================
   RECHERCHER
========================= */
async function rechercher(intention) {
  return bip.rechercher(intention);
}

/* =========================
   WOUNANET
========================= */
async function collecteWounanet(sujet) {
  return bip.collecteWounanet(sujet);
}

module.exports = {
  scanner,
  finaliser,
  rechercher,
  collecteWounanet,
  hermeneutique
};
