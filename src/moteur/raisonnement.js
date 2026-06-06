'use strict';

const { interpreterSujet } = require('./hermeneutique');
const { choisirIntention } = require('./intentions');

function analyserSujet(sujet, culture = 'africaine') {
  const categorie = interpreterSujet(sujet);
  const intention = choisirIntention(categorie);

  return {
    sujet,
    culture,
    categorie,
    intention,
    structure: 'raisonnement_triadique'
  };
}

function raisonner(sujet, culture) {
  return analyserSujet(sujet, culture);
}

module.exports = {
  analyserSujet,
  raisonner
};
