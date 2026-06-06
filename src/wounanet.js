'use strict';

const fetch = require('node-fetch');

class Wounanet {
  constructor() {
    // ✅ Correction : accepte les deux variables
    this.apiKey = process.env.WOUNANET_API_KEY || process.env.NEWSDATA_APIKEY || null;
  }

  async fetch(query) {
    const q = query.trim();
    if (!this.apiKey) {
      return {
        type: 'fallback',
        source: 'wounanet-standby',
        text: `🌐 WOUNANET standby : aucune clé API définie.`,
        query: q,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      // 1️⃣ Essai avec /news si sujet fourni
      let endpoint = q
        ? `https://newsdata.io/api/1/news?apikey=${this.apiKey}&q=${encodeURIComponent(q)}&language=fr`
        : `https://newsdata.io/api/1/latest?apikey=${this.apiKey}&language=fr`;

      let res = await fetch(endpoint);
      let data = await res.json();

      // 2️⃣ Si pas de résultats, fallback sur /latest
      if (!data?.results?.length && q) {
        endpoint = `https://newsdata.io/api/1/latest?apikey=${this.apiKey}&language=fr`;
        res = await fetch(endpoint);
        data = await res.json();
      }

      if (data?.results?.length) {
        const articles = data.results.slice(0, 3)
          .map(a => `- ${a.title}\n  🔗 ${a.link}`)
          .join('\n\n');
        return {
          type: 'external-newsdata',
          source: 'NewsData.io',
          text: `Articles trouvés sur "${q || 'actualité'}":\n\n${articles}`,
          query: q,
          timestamp: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.error("❌ Erreur API WOUNANET:", err.message);
      return {
        type: 'error',
        source: 'NewsData.io',
        text: `🚨 Erreur API NewsData.io pour "${q}".`,
        query: q,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      type: 'fallback',
      source: 'wounanet-standby',
      text: `🌐 WOUNANET standby : aucune donnée externe pour "${q}".`,
      query: q,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = new Wounanet();
