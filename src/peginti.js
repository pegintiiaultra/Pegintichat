detectDomain(question) {
    // Normalisation robuste
    const normalize = (str) => str
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // retire accents
      .replace(/’/g, "'") // remplace apostrophe typographique
      .replace(/[^a-z0-9' ]/g, " ") // retire caractères spéciaux
      .replace(/\s+/g, " ") // espaces propres
      .trim();

    const q = normalize(question);

    // CORE — Identité PEGINTI
    if (
      q.includes("peginti") ||
      q.includes("cest quoi") ||
      q.includes("c'est quoi") ||
      q.includes("definition peginti") ||
      q.includes("qui es tu") ||
      q.includes("qui es-tu") ||
      q.includes("presentation peginti") ||
      q.includes("peginti cest quoi")
    ) return "core";

    // STRAT
    if (
      q.includes("strategie") ||
      q.includes("plan") ||
      q.includes("business") ||
      q.includes("entreprise") ||
      q.includes("croissance")
    ) return "strat";

    // BIP
    if (
      q.includes("bible") ||
      q.includes("verset") ||
      q.includes("foi") ||
      q.includes("eglise")
    ) return "bip";

    // Fallback
    return "strat";
  }
