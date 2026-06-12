'use strict';

function narrer(analyse = {}) {
  const sujet = String(analyse.sujet || 'ce sujet').trim();
  const tension = Array.isArray(analyse.tensions) && analyse.tensions.length > 0
    ? analyse.tensions[0]
    : 'ce sujet révèle des contradictions';

  const doctrine = analyse.doctrine || '';
  const prospective = analyse.prospective || '';

  return `Le sujet ${sujet} révèle que ${tension}. ${doctrine} ${prospective}`.trim();
}

module.exports = {
  narrer
};
