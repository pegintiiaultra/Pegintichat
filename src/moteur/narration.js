'use strict';

function construire({ sujet, analyse, impact }) {
  // Narration fluide avec connecteurs rhétoriques
  const introduction = `Il faut noter que le sujet "${sujet}" mérite une attention particulière. En ce qui concerne les informations collectées, ${analyse}`;
  
  const developpement = `Ensuite, en effet, l'examen des données met en lumière ${impact || 'des tendances significatives'} qui permettent de mieux comprendre la situation.`;
  
  const conclusion = `Enfin, il apparaît nécessaire de poursuivre la réflexion afin d'anticiper les évolutions et d'en tirer des enseignements utiles.`;

  return {
    introduction,
    developpement,
    conclusion
  };
}

module.exports = { construire };
