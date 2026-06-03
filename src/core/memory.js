'use strict';

const fs = require("fs");

class Memory {
  constructor() {
    this.store = {};
  }

  // Charger la mémoire depuis un fichier JSON
  load(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, "utf8");
        this.store = JSON.parse(data);
      }
    } catch (err) {
      console.error("❌ Erreur lors du chargement de la mémoire:", err);
    }
  }

  // Sauvegarder la mémoire dans un fichier JSON
  save(filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(this.store, null, 2), "utf8");
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde de la mémoire:", err);
    }
  }
}

module.exports = Memory;
