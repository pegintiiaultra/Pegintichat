'use strict';

const axios = require('axios');
const memory = require('./memory');
const wounanet = require('./wounanet');
const translator = require('./translator');
const Nsissim = require('./nsissim');

// Initialiser Nsissim avec les modules requis
const nsissim = new Nsissim(memory, null, wounanet, translator);

// Fonction de traduction via LibreTranslate (gratuit, sans clé)
async function translateText(text, targetLang = 'en') {
  try {
    const res = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: 'auto',   // détection automatique de la langue
      target: targetLang,
      format: 'text'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.translatedText;
  } catch (e) {
    return text; // si erreur, garder le texte original
  }
}

async function filterInput(input) {
  // Nettoyage
  const cleanInput = input.replace(/^PEGINTI>\s*/, '').trim();

  // Traduction automatique vers l’anglais (pour normaliser la requête)
  const translated = await translateText(cleanInput, 'en');

  // Appel à nsissim avec la requête traduite
  const response = await nsissim.process(cleanInput);

  // Affichage bilingue
  return {
    original: cleanInput,
    translated,
    topic: response.topic,
    frame: response.frame,
    reply: response.reply
  };
}

module.exports = { filterInput };
