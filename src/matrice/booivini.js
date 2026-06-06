'use strict';

// Module doctrinal BO'OIVINI minimal
const raisonnement = {
  raisonner: (question, culture) => {
    return {
      cosmique: `Analyse cosmique de "${question}"`,
      communautaire: `Perspective communautaire (${culture})`,
      pedagogique: `Explication pédagogique`,
      structure: `Structure logique appliquée`
    };
  }
};

module.exports = { raisonnement };
