'use strict';

function extraireContexte({ question = '', memoire = [], doctrine = {}, sources = [] } = {}) {
  const q = String(question || '').trim();
  const qLower = q.toLowerCase();

  const memoirePertinente = memoire.filter(item =>
    String(item?.sujet || '').toLowerCase().includes(qLower) ||
    qLower.includes(String(item?.sujet || '').toLowerCase())
  ).slice(0, 3);

  const doctrineTexte =
    doctrine[q] ||
    doctrine[qLower] ||
    doctrine[q.toUpperCase()] ||
    '';

  const titres = sources
    .map(s => String(s?.source_name || s?.title || s?.name || '').trim())
    .filter(Boolean)
    .slice(0, 10);

  return {
    question: q,
    memoirePertinente,
    doctrineTexte,
    sourceTitles: titres,
    totalSources: titres.length
  };
}

module.exports = { extraireContexte };
