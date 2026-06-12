'use strict';

module.exports = {
  nom: 'vision',
  categories: ['general', 'souverainete', 'geopolitique'],
  intentions: ['analytique'],
  handle: async (context) => {
    return `Vision prospective : "${context.sujet}" peut produire des effets durables sur la société et ses équilibres.`;
  }
};
