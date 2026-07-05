'use strict';

// Scanner doctrinal : identifie un module lié au sujet
function scan(sujet) {
  const mots = sujet.toLowerCase().split(/\s+/);
  if (mots.includes('philosophie')) {
    return { narration: {
      reponse: "La philosophie africaine exprime les valeurs et traditions propres aux sociétés africaines.",
      developpement: "Elle s'appuie sur la sagesse des anciens et la réflexion critique sur les défis contemporains.",
      conclusion: "Elle élabore des concepts enracinés dans l'expérience africaine."
    }};
  }
  return null;
}

module.exports = { scan };
