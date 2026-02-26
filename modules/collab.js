module.exports = {
  router: (question) => {
    const q = question.toLowerCase();
    
    // 💎 Bo'oivinichat PREMIUM (priorité mots-clés entreprise)
    const premium = [
      'tomtech', 'tomtech.inc', 'bertrand tomo', 'entreprise', 'client', 
      'code', 'sdk', 'programme', 'logiciel', 'agent technique', 'securite'
    ];
    
    // 🌍 PEGINTICHAT (tout le reste)
    const public = ['recherche', 'explique', 'histoire', 'societe', 'bible'];

    if (premium.some(word => q.includes(word))) {
      return {
        question,
        destination: "Bo'oivinichat",
        module: "PREMIUM",
        confiance: 95,
        status: "Entreprise/Premium"
      };
    }
    
    return {
      question,
      destination: "PEGINTICHAT", 
      module: "BIP",
      confiance: 90,
      status: "Communautaire"
    };
  }
};
