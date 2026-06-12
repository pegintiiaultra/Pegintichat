'use strict';

function analyser(sujet = '') {
  const safeSujet = String(sujet).trim();

  return {
    sujet: safeSujet,
    tensions: safeSujet
      ? [`Le sujet "${safeSujet}" révèle des contradictions.`]
      : ['Le sujet révèle des contradictions.'],
    coherences: safeSujet
      ? [`Le sujet "${safeSujet}" s’aligne avec certaines traditions.`]
      : ['Le sujet s’aligne avec certaines traditions.']
  };
}

module.exports = {
  analyser
};
