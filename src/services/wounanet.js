'use strict';

require('dotenv').config();

async function search(query = 'Afrique') {
  try {

    const apiKey = process.env.WOUNANET_API_KEY;

    if (!apiKey) {
      return {
        status: 'ERROR',
        error: 'WOUNANET_API_KEY manquante'
      };
    }

    const url =
      `https://newsdata.io/api/1/news?apikey=${apiKey}` +
      `&q=${encodeURIComponent(query)}` +
      `&language=fr`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'success') {
      return {
        status: 'ERROR',
        error: data.results?.message || 'API NewsData'
      };
    }

    const articles = Array.isArray(data.results)
      ? data.results.slice(0, 10)
      : [];

    return {
      status: 'OK',
      total: articles.length,
      articles
    };

  } catch (err) {

    return {
      status: 'ERROR',
      error: err.message
    };

  }
}

module.exports = {
  search
};
