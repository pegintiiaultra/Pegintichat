'use strict';

module.exports = {
  nom: 'paix',
  categories: ['coherence_sociale', 'spirituel', 'general'],
  intentions: ['standard'],
  handle: async (context) => {
    return `La paix invite à traiter "${context.sujet}" avec équilibre, retenue et recherche d’harmonie sociale.`;
  }
};
