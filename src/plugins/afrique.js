'use strict';

module.exports = {
  nom: 'afrique',
  categories: ['identite_culturelle', 'geopolitique', 'general'],
  intentions: ['standard', 'analytique'],
  handle: async (context) => {
    return `Lecture africaine du sujet "${context.sujet}" dans un cadre de cohésion, d’histoire et de souveraineté.`;
  }
};
