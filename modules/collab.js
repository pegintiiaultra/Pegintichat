module.exports = {
  router: (question) => {
    const q = question.toLowerCase();

    // Critères PEGINTICHAT (GAUCHE)
    if (q.includes("recherche") || q.includes("technologie") || q.includes("correction simple")) {
      return { cible: "PEGINTICHAT", module: "BIP", type: "public" };
    }

    // Critères Bo'oivinichat (DROIT)
    if (q.includes("fondateur") || q.includes("entreprise") || q.includes("premium") ||
        q.includes("développement peginti") || q.includes("code spécifique") ||
        q.includes("client") || q.includes("logiciel")) {
      return { cible: "Bo'oivinichat", module: "PREMIUM", type: "privé" };
    }

    // Par défaut → PEGINTICHAT
    return { cible: "PEGINTICHAT", module: "BIP", type: "public" };
  }
};
