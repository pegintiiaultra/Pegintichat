/**
 * Module de collaboration PEGINTICHAT ↔ Bo'oivinichat
 * Routage dynamique et modulaire des questions
 */
module.exports = {
  router: (question) => {
    const q = question.toLowerCase();

    // --- PEGINTICHAT (GAUCHE) ---
    // Recherche générale, doctrinale, biblique, culturelle, historique
    const criteresPublic = [
      "recherche", "technologie", "correction simple",
      "bible", "dieu", "juif", "israelite",
      "culture", "histoire", "avancement", "question générale"
    ];

    // --- Bo'oivinichat (DROIT) ---
    // Premium, fondateur, développement spécifique, clients
    const criteresPremium = [
      "fondateur", "entreprise", "premium",
      "développement peginti", "code spécifique",
      "client", "logiciel", "programme",
      "accompagnement", "agent technique"
    ];

    if (criteresPublic.some(c => q.includes(c))) {
      return { cible: "PEGINTICHAT", module: "BIP", type: "public" };
    }

    if (criteresPremium.some(c => q.includes(c))) {
      return { cible: "Bo'oivinichat", module: "PREMIUM", type: "privé" };
    }

    // --- Par défaut → PEGINTICHAT ---
    return { cible: "PEGINTICHAT", module: "BIP", type: "public" };
  }
};
