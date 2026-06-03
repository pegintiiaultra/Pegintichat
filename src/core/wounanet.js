'use strict';

const fetch = require("node-fetch");
const { HttpsProxyAgent } = require("https-proxy-agent");

class Wounanet {
  constructor() {
    this.apiKey = process.env.NEWSDATA_APIKEY || null;
    this.proxy = process.env.HTTPS_PROXY || null;

    this.base = {
      "PEGINTI": "Plateforme souveraine d'intelligence artificielle.",
      "Nsissim": "Orchestrateur doctrinal et mémoire PEGINTI.",
      "Wounanet": "Encyclopédie hybride (statique + dynamique via NewsData.io).",
      "identité": "Reconnaissance de soi et des valeurs d'une communauté.",
      "philosophie": "Réflexion critique sur l'existence et les valeurs."
    };
  }

  async fetch(query) {
    if (this.base[query]) return this.base[query];

    if (this.apiKey) {
      try {
        const url = `https://newsdata.io/api/1/latest?apikey=${this.apiKey}&q=${encodeURIComponent(query)}&language=fr`;
        const options = this.proxy ? { agent: new HttpsProxyAgent(this.proxy) } : {};
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const titles = data.results.slice(0, 3).map(a => `- ${a.title}`).join("\n");
          return `Articles trouvés sur "${query}" :\n${titles}`;
        }
      } catch (err) {
        console.error("❌ Erreur Wounanet dynamique:", err);
      }
    }

    return `Aucune information disponible sur "${query}". PEGINTI recommande une réflexion doctrinale ou culturelle propre aux valeurs africaines.`;
  }
}

module.exports = Wounanet;
