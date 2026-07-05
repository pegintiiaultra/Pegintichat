// Module statique Wounanet : encyclopédie permanente
module.exports = {
  lookup: (query) => {
    const base = {
      "PEGINTI": "Plateforme souveraine d'intelligence artificielle.",
      "Nsissim": "Orchestrateur doctrinal et mémoire PEGINTI.",
      "Wounanet": "Encyclopédie hybride (statique + dynamique via NewsAPI)."
    };
    return base[query] || null;
  }
};
