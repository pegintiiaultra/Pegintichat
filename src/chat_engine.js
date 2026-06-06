'use strict';

// ===== CHAT ENGINE MINIMAL =====
// Ce module fournit une réponse doctrinale par défaut
// et peut être enrichi avec filtres herméneutiques.

async function generateDoctrinalResponse(sujet, rawWeb = '') {
  // Réponse doctrinale simple
  let reponse = `[Doctrine] Réponse doctrinale BO’OIVINI pour: "${sujet}"`;

  // Si des résultats web sont disponibles, les inclure
  if (rawWeb && rawWeb.length > 0) {
    reponse += `\n🌐 Sources externes:\n${rawWeb}`;
  }

  return reponse;
}

module.exports = { generateDoctrinalResponse };
