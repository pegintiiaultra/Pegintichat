module.exports = {
  router: (question) => {
    const q = question.toLowerCase().trim();

    // PEGINTICHAT (doctrinal/public)
    const pegintiCriteres = [
      'bible','dieu','juif','israel','culture','histoire','société',
      'explication','définition','recherche','information','doctrinal','public'
    ];

    // Bo'oivinichat (premium/confidentiel)
    const boiviniCriteres = [
      'tomtech','tomtech.inc','sécurité','entreprise','client','confidentiel',
      'sdk','api','programme','code spécial','copies spécialisées','technologie peginti'
    ];

    if (boiviniCriteres.some(c => q.includes(c))) {
      return {question:q,destination:"Bo'oivinichat",module:"PREMIUM",type:"technique/confidentiel",status:"✅ Bo'oivinichat spécifique",confiance:95};
    }
    if (pegintiCriteres.some(c => q.includes(c))) {
      return {question:q,destination:"PEGINTICHAT",module:"BIP",type:"public/doctrinal",status:"✅ PEGINTICHAT prioritaire",confiance:90};
    }
    return {question:q,destination:"PEGINTICHAT",module:"BIP",type:"public/défaut",status:"ℹ️ PEGINTICHAT (défaut)",confiance:80};
  }
};
