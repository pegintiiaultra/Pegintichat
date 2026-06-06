'use strict';

const Filters = require("./filters");
const Wounanet = require("./wounanet");
const Doctrine = require("./doctrine");
const Nsissim = require("./nsissim");

class Memory {
  constructor() {
    this.store = {};

    this.filters = new Filters();
    this.wounanet = new Wounanet();
    this.doctrine = new Doctrine();
    this.nsissim = new Nsissim();
  }

  async process(input) {
    try {
      // 🔍 Normalisation
      const query = this.nsissim.normalize
        ? this.nsissim.normalize(input)
        : input.toLowerCase().trim();

      // 🧠 Mémoire locale
      let result = this.store[query];

      // 🌐 WOUNANET connecté
      if (!result && this.wounanet.fetch) {
        try {
          result = await this.wounanet.fetch(query);
        } catch (e) {
          console.log("⚠️ Wounanet erreur:", e.message);
        }
      }

      // 📚 Apprentissage automatique
      if (!result) {
        result = `Nouvelle connaissance apprise sur "${query}"`;
        this.store[query] = result;
      }

      // ⚖️ Doctrine
      let finalReply = result;
      if (this.doctrine.validate) {
        try {
          finalReply = this.doctrine.validate(query, result);
        } catch (e) {
          console.log("⚠️ Doctrine erreur:", e.message);
        }
      }

      return {
        topic: query,
        frame: "PEGINTI_CORE",
        reply: finalReply
      };

    } catch (error) {
      console.error("❌ Erreur Memory:", error);

      return {
        topic: input,
        frame: "ERROR",
        reply: "Erreur interne PEGINTI IA"
      };
    }
  }
}

module.exports = Memory;
