'use strict';

function filterDoctrine(analyse = {}) {
  const sujet = String(analyse.sujet || '').trim();

  return {
    ...analyse,
    doctrine: analyse.doctrine || `Selon la matrice africaine, "${sujet}" doit être évalué à la lumière des valeurs traditionnelles.`
  };
}

module.exports = {
  filterDoctrine
};
