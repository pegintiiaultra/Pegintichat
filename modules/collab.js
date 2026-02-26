/**
 * Module de collaboration PEGINTICHAT ↔ Bo'oivinichat
 * Routage dynamique et modulaire des questions
 */
module.exports = {
  router: (question) => {
    const q = question.toLowerCase();

    // --- PEGINTICHAT (GAUCHE) ---
    const criteresPublic = [
      "recherche", "technologie", "correction simple",
      "bible", "dieu", "juif", "israelite",
      "culture", "histoire", "avancement", "question générale"
    ];

    // --- Bo'oivinichat (DROIT) ---
    const criteresPremium = [
      "fondateur", "entreprise", "premium",
      "développement peginti", "code spécifique",
      "client", "logiciel", "programme",
      "accompagnement", "agent technique"
    ];

    if (criteresPublic.some(c => q.includes(c))) {
      return { question, cible: "PEGINTICHAT", module: "BIP", type: "public", status: "Routage dynamique OK" };
    }

    if (criteresPremium.some(c => q.includes(c))) {
      return { question, cible: "Bo'oivinichat", module: "PREMIUM", type: "privé", status: "Routage dynamique OK" };
    }

    return { question, cible: "PEGINTICHAT", module: "BIP", type: "public", status: "Routage par défaut" };
  }
};
