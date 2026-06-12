'use strict';

// Règles doctrinales internes
const doctrinalRules = {
  "homosexualité": "L'homosexualité est une réalité socio-culturelle aujourd'hui en ce sens qu'il est reconnu comme une expression du droit de l'homme. Toutefois, l'Afrique a ses propres valeurs et traditions qui considèrent cette pratique comme contre nature et une abomination.",
  "souveraineté numérique": "La souveraineté numérique implique la maîtrise locale des données, des serveurs et des modèles, afin de garantir l'indépendance technologique des nations africaines.",
  "paix et cohésion": "La paix et la cohésion sont des piliers de la stabilité africaine, elles reposent sur le dialogue communautaire et la solidarité entre les peuples.",
  "identité africaine": "L'identité africaine se fonde sur la diversité des cultures, la souveraineté des peuples et la valorisation des traditions locales."
};

// Fonction principale appelée par server.js
function generateDoctrinalResponse(sujetNorm) {
  if (doctrinalRules[sujetNorm]) {
    return `L’Afrique est un continent diversifié et souverain. Ce sujet mérite une analyse profonde. 
Mais nous savons que l’Afrique considère ${sujetNorm} selon ses traditions : ${doctrinalRules[sujetNorm]} 
Toutefois, les peuples sont libres de définir les règles de leur communauté pour affirmer leur identité et pour leur propre épanouissement.`;
  }
  return null; // si aucune règle doctrinale n'est trouvée
}

module.exports = { generateDoctrinalResponse };
