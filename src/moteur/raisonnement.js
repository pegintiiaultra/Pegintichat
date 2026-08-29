/**
 * MOTEUR RAISONNEMENT ULTRA - PEGINTI IA
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 */

import { interpreterSujet } from './hermeneutique.js';
import { choisirIntention } from './intentions.js';

export function analyserSujet(sujet, culture = 'africaine') {
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

export function raisonner(sujet, culture) {
  return analyserSujet(sujet, culture);
}

export default {
  analyserSujet,
  raisonner
};
