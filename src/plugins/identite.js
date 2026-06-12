'use strict';

module.exports = {
  nom: 'identite',
  categories: ['identite_culturelle'],
  intentions: ['standard', 'analytique'],
  handle: async (context) => {
    return `Le sujet "${context.sujet}" engage l’identité, la mémoire collective et la définition de soi.`;
  }
};
