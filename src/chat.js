'use strict';

const readline = require('readline');
const Nsissim = require('./core/nsissim');
const Wounanet = require('./core/wounanet');

// Modules fictifs pour l’exemple (à remplacer par tes vrais fichiers)
const memory = {}; 
const filters = { apply: (x) => x }; 
const translator = { 
  detectLanguage: async (txt) => 'fr', 
  isRecognized: () => true, 
  translate: async (txt, from, to) => txt 
};

// Instanciation avec dépendances
const wounanet = new Wounanet();
const nsissim = new Nsissim(memory, filters, wounanet, translator);

console.log("=== PEGINTI IA INTERACTIF ===");
console.log("Tapez vos messages. Utilisez Ctrl+C pour quitter.\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'PEGINTI> '
});

async function processQuery(input) {
  try {
    let response = await nsissim.process(input);
    console.log("=== Réponse PEGINTI IA ===");
    console.log(`Sujet : ${response.topic}`);
    console.log(`Cadre : ${response.frame}`);
    console.log(`${response.reply}\n`);
  } catch (err) {
    console.error("Erreur lors du traitement :", err.message);
  }
}

rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();
  if (input.length > 0) {
    await processQuery(input);
  }
  rl.prompt();
}).on('close', () => {
  console.log("=== Session terminée ===");
  process.exit(0);
});
