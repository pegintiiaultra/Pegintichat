'use strict';

module.exports = {
  nom: 'peginti',
  categories: [],
  intentions: ['standard', 'analytique'],
  handle: async (context) => {
    return `PEGINTICHAT traite le sujet "${context.sujet}" selon sa logique interne et ses lectures contextuelles.`;
  }
};
