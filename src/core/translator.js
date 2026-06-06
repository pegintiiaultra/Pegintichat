'use strict';

class Translator {
  constructor() {
    // Langues supportées par défaut
    this.supported = ['fr', 'en'];
  }

  async detectLanguage(text) {
    if (!text || typeof text !== 'string') return 'en';

    // Détection simplifiée : si accents ou mots français → fr
    const frenchPattern = /[àâçéèêëîïôùûü]|(bonjour|salut|merci|mort|vie)/i;
    return frenchPattern.test(text) ? 'fr' : 'en';
  }

  isRecognized(lang) {
    return this.supported.includes(lang);
  }

  async translate(text, from, to) {
    // Stub de traduction : renvoie le texte tel quel
    // Tu pourras brancher une vraie logique plus tard
    return text;
  }
}

module.exports = Translator;
