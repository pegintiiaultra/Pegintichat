/**
 * Module PEGINTI - Comparateur
 * Détection des doublons, pondération des sources,
 * hiérarchisation thématique et synthèse multi-niveaux.
 */

function comparer(resultats) {
  // 1. Détection des doublons
  const unique = {};
  resultats.forEach(article => {
    const cle = article.titre.trim().toLowerCase();
    if (!unique[cle]) {
      unique[cle] = { ...article, sources: [article.source] };
    } else {
      unique[cle].sources.push(article.source);
    }
  });

  // 2. Pondération des sources
  const poidsSources = {
    'rfi_fr': 3,
    'senego': 3,
    'lesoleil': 2,
    'eurosport_fr': 2,
    'blick_ch_fr': 1,
    'globenewswire': 1
  };

  Object.values(unique).forEach(article => {
    article.score = article.sources.reduce((acc, src) => {
      return acc + (poidsSources[src] || 1);
    }, 0);
  });

  // 3. Hiérarchisation thématique
  const themes = { politique: [], economie: [], culture: [], sport: [], autres: [] };
  Object.values(unique).forEach(article => {
    const titre = article.titre.toLowerCase();
    if (titre.includes('sonko') || titre.includes('pastef')) {
      themes.politique.push(article);
    } else if (titre.includes('orange') || titre.includes('sfr')) {
      themes.economie.push(article);
    } else if (titre.includes('alphadi') || titre.includes('roman')) {
      themes.culture.push(article);
    } else if (titre.includes('football') || titre.includes('xhaka')) {
      themes.sport.push(article);
    } else {
      themes.autres.push(article);
    }
  });

  // 4. Synthèse multi-niveaux
  const synthese = {
    niveau1: "Résumé factuel des articles filtrés.",
    niveau2: "Analyse doctrinale par thème.",
    niveau3: "Projection stratégique des tendances."
  };

  return { themes, synthese };
}

module.exports = { comparer };
