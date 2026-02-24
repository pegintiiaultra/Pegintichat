'use strict';
module.exports = {
  analyse: (data, context) => ({
    module: 'BIP',
    cadre1: 'Texte biblique exact',
    cadre2: 'Tradition ecclésiale',
    cadre3: context.user_view || 'Conscience souveraine',
    score: 100
  })
};
