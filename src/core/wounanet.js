class Wounanet {
  async search(query) {
    console.log("🌍 Recherche Internet simulée pour:", query);

    if (query.includes("photosynthèse")) {
      return "La photosynthèse est le processus biologique par lequel les plantes transforment l'énergie lumineuse en énergie chimique.";
    }

    if (query.includes("internet")) {
      return "Internet est un réseau mondial interconnecté permettant l'échange d'informations.";
    }

    return `Résultat simulé pour la recherche: ${query}`;
  }
}

module.exports = Wounanet;
