'use strict';

const fs = require('fs');
const path = require('path');

class Doctrine {
  constructor() {
    const filePath = path.join(__dirname, '../db/doctrine.json');
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      this.data = JSON.parse(raw);
    } catch (err) {
      console.error("Erreur chargement doctrine.json :", err);
      this.data = {};
    }
  }

  // Vérifie si un sujet existe dans la doctrine
  has(topic) {
    return Object.prototype.hasOwnProperty.call(this.data, topic);
  }

  // Récupère la réponse doctrinale brute
  get(topic) {
    if (this.has(topic)) {
      return this.data[topic].reponse || "";
    }
    return "";
  }

  // Vérifie si un sujet est sensible (exemple : politique, sexualité, religion)
  isSensitive(topic) {
    const sensitiveKeywords = [
      'homosexualite',
      'sorcellerie',
      'idolatrie',
      'mort',
      'religion',
      'politique'
    ];
    return sensitiveKeywords.includes(topic);
  }

  // Prépare une réponse doctrinale formatée
  getDoctrineReply(topic) {
    if (this.has(topic)) {
      const cadre = this.data[topic].cadre || "Doctrine";
      const reponse = this.data[topic].reponse || "";
      return `[${cadre}] ${reponse}`;
    }
    return `Aucune doctrine définie pour "${topic}".`;
  }
}

module.exports = Doctrine;
