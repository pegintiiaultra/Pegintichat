'use strict';

module.exports = {
  nom: 'religion',
  categories: ['spirituel', 'coherence_sociale'],
  intentions: ['standard', 'analytique'],
  handle: async (context) => {
    return `Le sujet "${context.sujet}" doit être compris à la lumière des convictions, des traditions et du vivre-ensemble.`;
  }
};
