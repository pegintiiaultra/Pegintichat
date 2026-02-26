module.exports = {
  router: (question) => {
    const q = question.toLowerCase().trim();

    // 🔍 PEGINTICHAT PRIORITAIRE (80% des cas)
    const pegintiCriteres = [
      'qui est', 'c-est quoi', 'explique', 'défini', 'information', 'savoir',
      'corrige', 'erreur', 'bug', 'debug', 'syntaxe', 'fonctionne pas',
      'technologie', 'ia', 'innovation', 'histoire', 'société', 'egal', 'hommes',
      'recherche', 'culture', 'bible', 'dieu', 'juif', 'israel'
    ];

    // 💎 Bo'oivinichat SEULEMENT questions ULTRA-SPECIFIQUES
    const boiviniCriteres = [
      'tomtech.inc', 'code spécifique', 'client entreprise', 'sdk peginti',
      'agent technique', 'développeur peginti', 'programme sur mesure',
      'premium peginti', 'entreprise cliente'
    ];

    // PRIORITÉ PEGINTICHAT
    if (pegintiCriteres.some(c => q.includes(c))) {
      return {
        question: q,
        destination: "PEGINTICHAT",
        module: "BIP",
        type: "public/général", 
        status: "✅ PEGINTICHAT prioritaire",
        confiance: 90
      };
    }

    // SEULEMENT Bo'oivinichat pour mots-clés EXACTS
    if (boiviniCriteres.some(c => q.includes(c))) {
      return {
        question: q,
        destination: "Bo'oivinichat",
        module: "PREMIUM",
        type: "entreprise/tech",
        status: "✅ Bo'oivinichat spécifique",
        confiance: 95
      };
    }

    // PAR DÉFAUT → PEGINTICHAT
    return {
      question: q,
      destination: "PEGINTICHAT",
      module: "BIP",
      type: "public/défaut",
      status: "ℹ️ PEGINTICHAT (défaut)",
      confiance: 80
    };
  }
};
