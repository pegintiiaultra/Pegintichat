'use strict';

/**
 * Analyseur minimal pour PEGINTICHAT
 * Retourne une intention générique avec un niveau de confiance.
 */
function analyser(question) {
  if (!question || typeof question !== 'string') {
    return { type: 'general', confiance: 0.0 };
  }

  const q = question.toLowerCase();

  if (q.includes('philosophie')) {
    return { type: 'philosophie', confiance: 0.8 };
  }
  if (q.includes('afrique')) {
    return { type: 'identité', confiance: 0.7 };
  }
  if (q.includes('intelligence artificielle')) {
    return { type: 'technologie', confiance: 0.9 };
  }

  // Par défaut
  return { type: 'general', confiance: 0.5 };
}

module.exports = { analyser };
