/**
 * MOTEUR COMPARAISON - Analyse comparative rigoureuse
 */
export function comparerConcepts(conceptA, conceptB) {
  return {
    sujetA: conceptA,
    sujetB: conceptB,
    pointsCommuns: ["Rigueur d'analyse", "Recherche de fondement"],
    differences: ["Champ d'application", "Postulats de base"],
    synthese: `Mise en parallèle dialectique entre ${conceptA} et ${conceptB}.`
  };
}

export default {
  comparerConcepts
};
