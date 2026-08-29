/**
 * MOTEUR DIALECTIQUE ULTRA - PEGINTI IA
 * Conçu par Tomo Ombede Barnabé Bertrand (TOMTECH.INC)
 */

import { interpreterSujet } from './hermeneutique.js';
import { choisirIntention } from './intentions.js';

export function confronterLectures(sujet, contexte = {}) {
  const categorie = interpreterSujet(sujet);
  const intention = choisirIntention(categorie);

  return {
    sujet,
    categorie,
    intention,
    contexte,
    synthese: `Lecture ${categorie} appliquée à "${sujet}".`
  };
}

export function construireReponseFinale(sujet, base, contexte = {}) {
  const lecture = confronterLectures(sujet, contexte);
  return [
    `QUESTION : ${sujet}`,
    '',
    base,
    '',
    `Intention : ${lecture.intention.mode}`,
    `Catégorie : ${lecture.categorie}`,
    `Axe souverain : souveraineté numérique africaine.`
  ].join('\n');
}

export function structurerDialectique(these, antithese) {
  return {
    these,
    antithese,
    synthese: "Dépassement par l'excellence et l'intégration des paradoxes",
    methode: "Rigueur analytique continue"
  };
}

export default {
  confronterLectures,
  construireReponseFinale,
  structurerDialectique
};
