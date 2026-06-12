'use strict';

module.exports = {
  nom: 'souverainete',
  categories: ['souverainete', 'geopolitique'],
  intentions: ['standard', 'analytique'],
  handle: async (context) => {
    return `La souveraineté impose d’examiner "${context.sujet}" à partir des intérêts propres de la communauté concernée.`;
  }
};
