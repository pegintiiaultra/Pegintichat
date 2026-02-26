/*
 * PEGINTI - ROUTAGE INTELLIGENT DYNAMIQUE v2.0
 * PEGINTICHAT (public) vs Bo'oivinichat (premium)
 */
module.exports = {
  router: (question) => {
    const q = question.toLowerCase().trim();

    // 🔍 PEGINTICHAT (BIP 👁️) - Questions PUBLIC
    const pegintiCriteres = [
      'recherche', 'information', 'savoir', 'explique', 'défini', 'c-est quoi',
      'corrige', 'erreur', 'bug', 'debug', 'syntaxe', 'fonctionne pas',
      'technologie', 'nouveau', 'innovation', 'dernière', '202', 'ia', 'blockchain'
    ];

    // 💎 Bo'oivinichat (PREMIUM) - Questions PRO
    const boiviniCriteres = [
      'tomtech', 'fondateur', 'peginti', 'bo-oivini', 'boivini', 'tomtech.inc',
      'entreprise', 'client', 'logiciel', 'programme', 'sdk', 'api', 
      'correction code', 'code spécifique', 'agent technique', 'premium'
    ];

    const pegintiMatch = pegintiCriteres.some(critere => q.includes(critere));
    const boiviniMatch = boiviniCriteres.some(critere => q.includes(critere));

    if (boiviniMatch) {
      return {question:q,destination:"Bo'oivinichat",module:"PREMIUM",type:"entreprise/développeur",status:"✅ Routage PREMIUM",confiance:95};
    }
    if (pegintiMatch) {
      return {question:q,destination:"PEGINTICHAT",module:"BIP",type:"public/recherche",status:"✅ Routage PEGINTICHAT",confiance:90};
    }
    return {question:q,destination:"PEGINTICHAT",module:"BIP",type:"public/général",status:"ℹ️ Par défaut",confiance:75};
  }
};
