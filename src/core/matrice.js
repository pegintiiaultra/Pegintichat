'use strict';

/**
 * Module PEGINTI - Matrice doctrinale
 * Centralise la logique souveraine : triade (Faits → Doctrine → Projection).
 */

function appliquerMatrice(themes) {
  const resultat = {
    faits: [],
    doctrine: [],
    projection: []
  };

  // 1. Faits : extraire les titres par thème
  Object.keys(themes).forEach(theme => {
    themes[theme].forEach(article => {
      resultat.faits.push(`[${theme}] ${article.titre}`);
    });
  });

  // 2. Doctrine : interprétation doctrinale
  if (themes.politique.length > 0) {
    resultat.doctrine.push("La politique illustre une recomposition doctrinale.");
  }
  if (themes.economie.length > 0) {
    resultat.doctrine.push("L'économie révèle une dynamique de souveraineté et de stratégie.");
  }
  if (themes.culture.length > 0) {
    resultat.doctrine.push("La culture témoigne de la dignité et de la mémoire sociale.");
  }
  if (themes.sport.length > 0) {
    resultat.doctrine.push("Le sport reflète les tensions et la compétition mondiale.");
  }

  // 3. Projection : anticipation stratégique
  resultat.projection.push("Ces dimensions annoncent une recomposition globale, entre défis et créativité.");

  return resultat;
}

module.exports = { appliquerMatrice };
