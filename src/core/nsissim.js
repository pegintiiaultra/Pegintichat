'use strict';

const doctrineData = require('../data/doctrine.js');

class Nsissim {
  constructor(memory, filters, wounanet, translator) {
    this.memory = memory;
    this.filters = filters;
    this.wounanet = wounanet;       // module pour encyclopédies, dictionnaires, articles, actualités
    this.translator = translator;   // module de traduction (LibreTranslate)
  }

  normalizeDoctrine(topic) {
    return (topic || "")
      .toLowerCase()
      .replace(/[?!.]/g, '')   // enlever ponctuation
      .trim()
      .replace(/^(la |le |les |un |une |l' )/, ''); // enlever articles
  }

  async process(input) {
    const normalized = (input || "")
      .toLowerCase()
      .replace(/[?!.]/g, '')   // enlever ponctuation
      .trim();

    let topic = normalized;
    let frame = "Universel";
    let reply = null;

    // === Route 1 : Réponse universelle ===
    try {
      reply = await this.wounanet.fetch(topic);
    } catch (e) {
      reply = null;
    }

    if (!reply || reply.trim() === "") {
      reply = `Le concept de "${topic}" est une notion étudiée dans les dictionnaires, encyclopédies, articles et documentaires.`;
    }

    // === Route 2 : Réponse doctrinale (via doctrine.js) ===
    const doctrinalKeys = Object.keys(doctrineData.regles.traitement);
    const normalizedTopic = this.normalizeDoctrine(topic);

    for (const key of doctrinalKeys) {
      if (normalizedTopic.includes(key)) {
        reply = doctrineData.regles.traitement[key].reponse;
        frame = "Doctrine";
        break;
      }
    }

    // === Route 3 : Conditions de traduction ===
    const userLang = await this.translator.detectLanguage(input);

    if (userLang === 'fr') {
      reply = await this.translator.translate(reply, 'fr', 'fr'); // reste en français
    } else if (this.translator.isRecognized(userLang)) {
      reply = await this.translator.translate(reply, 'fr', userLang);
    } else {
      reply = await this.translator.translate(reply, 'fr', 'fr');
    }

    return { topic, frame, reply };
  }
}

module.exports = Nsissim;
