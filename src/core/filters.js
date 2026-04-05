const fs = require("fs");
const path = require("path");

const DOCTRINE_PATH = path.join(__dirname, "../../data/doctrine.json");

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function loadDoctrine() {
  try {
    const data = fs.readFileSync(DOCTRINE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erreur de lecture du fichier doctrinal:", err);
    return {};
  }
}

class Filters {
  constructor() {
    this.doctrine = loadDoctrine();
  }

  reload() {
    this.doctrine = loadDoctrine();
    console.log("Doctrine rechargée automatiquement.");
  }

  apply(input) {
    this.reload();
    const interpreted = normalize(input);
    for (const key of Object.keys(this.doctrine)) {
      if (interpreted.includes(normalize(key))) {
        return this.doctrine[key];
      }
    }
    return null;
  }
}

module.exports = Filters;
