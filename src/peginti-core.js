'use strict';

const fs = require("fs");
const path = require("path");
const Memory = require("./core/memory");
const Filters = require("./core/filters");
const Nsissim = require("./core/nsissim");
const Wounanet = require("./core/wounanet");
const doctrine = require("./data/doctrine.js"); // Chargement du fichier doctrinal

// Instances
const memory = new Memory();
const filters = new Filters();
const wounanet = new Wounanet();
const nsissim = new Nsissim(memory, filters, wounanet, doctrine);

// Fonction principale
async function processQuery(input) {
  // 1. Traitement Nsissim (doctrine en priorité)
  let response = await nsissim.process(input);

  // 2. Filtrage
  response = filters.apply(response);

  // 3. Sauvegarde mémoire
  memory.store[input] = response.reply;
  memory.save(path.join(__dirname, "data/memory.json"));

  return response;
}

// Mode CLI
(async () => {
  const query = process.argv.slice(2).join(" ");
  if (!query) {
    console.log("⛔ Veuillez entrer une requête.");
    process.exit(1);
  }
  const result = await processQuery(query);
  console.log("=== PEGINTI IA ===");
  console.log("Sujet :", result.topic);
  console.log("Cadre :", result.frame);
  console.log("Réponse :", result.reply);
})();
