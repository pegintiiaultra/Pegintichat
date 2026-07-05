'use strict';

// Fonction de formulation doctrinale
function formuler({ question, intention, contexte, plan }) {
  const sujetNorm = String(question || '').toLowerCase().trim();

  // Liste des thèmes doctrinaux africains
  const themesDoctrinaux = [
    "éthique africaine",
    "culture africaine",
    "coutume africaine",
    "moralité en afrique",
    "morale africaine",
    "pédagogie africaine",
    "homosexualité en afrique",
    "vision africaine",
    "identité africaine",
    "souveraineté numérique",
    "paix et cohésion",
    "leadership africain"
  ];

  // Vérifier si le sujet correspond à un thème doctrinal
  const doctrinal = themesDoctrinaux.some(t => sujetNorm.includes(t));

  if (doctrinal) {
    return {
      frame: "Analyse doctrinale souveraine",
      reply: `PEGINTI IA considère "${question}" comme un sujet africain majeur.
Il mobilise les modules (raisonnement, doctrine, wounanet) pour produire une réponse enracinée dans la souveraineté africaine.`,
      restrictions: [
        "Doctrine appliquée : valeurs africaines",
        "Réponse structurée obligatoire"
      ]
    };
  }

  // Réponse par défaut si le sujet n'est pas doctrinal
  return {
    frame: "Réponse générique",
    reply: `Sujet "${question}" traité par le moteur générique.`,
    restrictions: ["Pas de doctrine spécifique détectée"]
  };
}

module.exports = { formuler };
