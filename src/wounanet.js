const axios = require('axios');

// Cache mémoire simple (clé = sujet)
let cache = {};

async function fetch(sujet) {
  const apiKey = process.env.WOUNANET_API_KEY;
  if (!apiKey) {
    return {
      type: "error",
      source: "Wounanet",
      text: "🚨 Clé API manquante. Configure WOUNANET_API_KEY.",
      query: sujet
    };
  }

  // Vérifier le cache (10 minutes)
  if (cache[sujet] && (Date.now() - cache[sujet].timestamp < 10 * 60 * 1000)) {
    return {
      ...cache[sujet].data,
      cached: true
    };
  }

  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(sujet)}&language=fr&country=cm,fr,cd,ci,sn&size=5`;

  try {
    const response = await axios.get(url, { timeout: 8000 });
    if (response.data.results && response.data.results.length > 0) {
      const articles = response.data.results.map(a => `- ${a.title}\n  🔗 ${a.link}`).join('\n\n');
      const result = {
        type: "external-newsdata",
        source: "NewsData.io",
        text: `Articles trouvés sur "${sujet}":\n\n${articles}`,
        query: sujet,
        timestamp: new Date().toISOString()
      };
      // Stocker en cache
      cache[sujet] = { data: result, timestamp: Date.now() };
      return result;
    } else {
      return {
        type: "error",
        source: "NewsData.io",
        text: `Aucun article trouvé pour "${sujet}".`,
        query: sujet
      };
    }
  } catch (e) {
    return {
      type: "error",
      source: "NewsData.io",
      text: `🚨 Erreur API NewsData.io pour "${sujet}". Quota ou clé.`,
      query: sujet
    };
  }
}

async function searchDirect(q) {
  return fetch(q);
}

module.exports = { fetch, searchDirect };
