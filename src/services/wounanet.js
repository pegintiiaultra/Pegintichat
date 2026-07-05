module.exports = {
  getActualites: async (sujet) => {
    return {
      status: "OK",
      total: 1,
      articles: [
        {
          title: "Actualité fictive",
          description: `Sujet demandé : ${sujet}`,
          source: "Wounanet (stub)"
        }
      ]
    };
  }
};
