const matriceInterne = require('./noyau/matrice-interne.js');
const filtresPrives = require('./logique/filtres-prives.js');
const preferencesNoyau = require('./preferences/comportement-noyau.json');
const reglesUltra = require('./systeme/regles-ultra.js');
const traductionConceptuelle = require('./systeme/traduction-conceptuelle.js');

function analyserSujet(sujet, culture) {
  let cosmique = null;

  if (matriceInterne.metaphoreCulturelle[sujet] &&
      matriceInterne.metaphoreCulturelle[sujet].cosmique) {
    cosmique = matriceInterne.metaphoreCulturelle[sujet].cosmique;
  }

  // Fusion cosmique + cycles ULTRA
  const cycles = reglesUltra.principesCreation || [];
  const cosmiqueFusion = cosmique ? { observations: cosmique, cyclesNaturels: cycles } : null;

  return {
    cosmique: cosmiqueFusion,
    communautaire: filtresPrives.traductionConceptuelle || null,
    pedagogique: reglesUltra.principesCreation || null,
    structure: "raisonnement_triadique"
  };
}

function raisonner(sujet, culture) {
  const analyse = analyserSujet(sujet, culture);
  return {
    interpretation: `En étudiant ${sujet}, on perçoit une dimension cosmique, communautaire et pédagogique.`,
    details: analyse,
    mode: "raisonnement_global",
    comportement: preferencesNoyau
  };
}

module.exports = {
  noyau: matriceInterne,
  logique: filtresPrives,
  preferences: preferencesNoyau,
  systeme: {
    reglesUltra,
    traductionConceptuelle
  },
  raisonnement: {
    analyserSujet,
    raisonner
  }
};
