'use strict';

/**
 * Bip Scanner : moteur ultra intelligent
 * Rôle : identifier la nature de la requête utilisateur
 * puis orienter vers le bon module doctrinal ou externe.
 */

function bipScanner(sujet) {
  const q = sujet.toLowerCase();

  // Doctrinal
  if (q.includes("souveraineté") || q.includes("identité") || q.includes("afrique")) {
    return "matrice";
  }

  // Biblique / spirituel
  if (q.includes("bible") || q.includes("moïse") || q.includes("josué") || q.includes("église") || q.includes("foi")) {
    return "philo";
  }

  // Stratégique / économique
  if (q.includes("entreprise") || q.includes("business") || q.includes("économie") || q.includes("développement")) {
    return "strat";
  }

  // Collaboration / organisation
  if (q.includes("association") || q.includes("organisation") || q.includes("séminaire")) {
    return "collab";
  }

  // Multilingue / culturel
  if (q.includes("langue") || q.includes("traduction") || q.includes("culture")) {
    return "polyglotte";
  }

  // Technique / logiciel
  if (q.includes("code") || q.includes("api") || q.includes("serveur") || q.includes("sdk")) {
    return "sdk";
  }

  // Prospective / IA / technologie
  if (q.includes("ia") || q.includes("intelligence artificielle") || q.includes("technologie") || q.includes("innovation") || q.includes("futur")) {
    return "prospective";
  }

  // Fallback : externe WOUNANET
  return "wounanet";
}

/**
 * Fonction de sécurité : ne jamais renvoyer vide
 */
function safeResponse(result) {
  if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
    return { message: "Aucune information à ce sujet" };
  }
  return result;
}

module.exports = { bipScanner, safeResponse };
