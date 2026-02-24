'use strict';

const BO_OIVINI = {
  supervise: (response, metadata) => {
    const { question, domain, context } = metadata;
    
    return {
      ...response,
      bo_oivini: {
        noyau: "BO'OIVINI v1.0",
        domaine: domain,
        question: question.substring(0, 50) + '...',
        coherence: "cohérent",
        priorite: "institutionnelle",
        certification: "PEGINTI Architecture 🇨🇲"
      },
      signature: "BO'OIVINI supervisé"
    };
  }
};

module.exports = BO_OIVINI;
