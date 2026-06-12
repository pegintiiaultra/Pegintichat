'use strict';

function evaluer(analyse = {}) {
  return {
    ...analyse,
    prospective: analyse.prospective || 'Ce sujet ouvre des perspectives sur l’avenir des sociétés africaines.'
  };
}

module.exports = {
  evaluer
};
