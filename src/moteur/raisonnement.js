'use strict';

function construirePlan(intention, contexte) {
  const type = intention?.type || 'general';
  const totalSources = Number(contexte?.totalSources || 0);

  const plans = {
    salutation: [
      'Répondre poliment et brièvement.',
      'Inviter à poser la question.'
    ],
    definition: [
      'Donner une définition simple.',
      'Ajouter un exemple si utile.'
    ],
    procedure: [
      'Expliquer les étapes dans l’ordre.',
      'Préciser les points de vigilance.'
    ],
    analyse: [
      'Présenter le contexte.',
      'Identifier les enjeux.',
      'Synthétiser l’impact.'
    ],
    comparaison: [
      'Comparer les éléments principaux.',
      'Conclure sur les différences importantes.'
    ],
    synthese: [
      'Résumer les points essentiels.',
      'Élaguer les détails secondaires.'
    ],
    conseil: [
      'Évaluer les options utiles.',
      'Proposer une recommandation claire.'
    ],
    general: [
      'Répondre de façon claire et utile.'
    ],
    politique: [
      'Formuler une réponse prudente.',
      'Rester factuel et contextualisé.'
    ]
  };

  const plan = plans[type] || plans.general;

  if (totalSources > 0) {
    plan.push(`Intégrer ${totalSources} source(s) pertinente(s).`);
  }

  return plan;
}

module.exports = { construirePlan };
