'use strict';

const { interpreterSujet } = require('./hermeneutique');
const { choisirIntention } = require('./intentions');

function confronterLectures(sujet, contexte = {}) {
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

function construireReponseFinale(sujet, base, contexte = {}) {
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

module.exports = {
  confronterLectures,
  construireReponseFinale
};
