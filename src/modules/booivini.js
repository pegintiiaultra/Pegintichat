'use strict';

const BO_OIVINI = {
  supervise: (response, metadata) => {
    const { question, context = {} } = metadata;
    const q = question.toLowerCase();
    
    // RAISONNEMENT MATRICIEL DYNAMIQUE
    let raisonnement = "";
    
    if (q.includes("bonjour") || q.includes("salut")) {
      raisonnement = "Salutation protocolaire → Initialisation matrice BO'OIVINI → Écosystème PEGINTI activé";
    } else if (q.includes("peginti")) {
      raisonnement = "Identité institutionnelle → CORE + supervision matricielle → Présentation écosystème";
    } else if (q.includes("strateg") || q.includes("plan")) {
      raisonnement = "Stratégie détectée → STRAT + analyse matricielle → Priorisation institutionnelle";
    } else {
      raisonnement = "Question générale → Analyse contextuelle BO'OIVINI → Réponse structurée";
    }
    
    return {
      ...response,
      bo_oivini: {
        matrice: "v1.0",
        raisonnement,
        domaine: response.module || "non-classé",
        certification: "BO'OIVINI 🇨🇲"
      }
    };
  }
};

module.exports = BO_OIVINI;
