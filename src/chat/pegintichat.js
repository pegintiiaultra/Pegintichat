'use strict';

/**
 * PEGINTICHAT — Hémisphère gauche du cerveau PEGINTI
 * Expression, interaction, synthèse visible
 */

const booovini = require('../matrice/booivini.js');

/* ---------------------------------------------------------
   🗣️ 1. Expression de la logique (hémisphère gauche)
--------------------------------------------------------- */
function exprimerLogique() {
  const logique = booovini.logique;

  return {
    metaphore: logique.matriceInterne.metaphoreCulturelle,
    principes: logique.matriceInterne.logiqueULTRA.principes,
    preferences: logique.preferencesNoyau,
    structure: "expression_logique_hemisphere_gauche"
  };
}

/* ---------------------------------------------------------
   🧩 2. Expression du raisonnement (hémisphère gauche)
--------------------------------------------------------- */
function exprimerRaisonnement(sujet, culture) {
  const resultat = booovini.raisonnement.raisonner(sujet, culture);

  return {
    analyse: resultat,
    structure: "expression_raisonnement_hemisphere_gauche"
  };
}

/* ---------------------------------------------------------
   🚀 EXPORT — Hémisphère gauche PEGINTICHAT
--------------------------------------------------------- */
module.exports = {
  logique: exprimerLogique,
  raisonner: exprimerRaisonnement
};
