#!/usr/bin/env node

const fs = require("fs");
const readline = require("readline");
const path = require("path");
const PermanentMemory = require("./core/memory");
const Filters = require("./core/filters");
const Nsissim = require("./core/nsissim");
const Wounanet = require("./core/wounanet");

const memory = new PermanentMemory();
const filters = new Filters();
const wounanet = new Wounanet();
const nsissim = new Nsissim(memory, filters, wounanet);

const args = process.argv.slice(2);
const liveMode = args.includes("--live");
const logMode = args.includes("--log");
const LOG_PATH = path.join(__dirname, "history.log");

function logConversation(input, response) {
  if (!logMode) return;
  const entry = `\n[${new Date().toISOString()}]\n> ${input}\n${JSON.stringify(response, null, 2)}\n`;
  fs.appendFileSync(LOG_PATH, entry);
}

if (!liveMode) {
  const input = args.filter(a => a !== "--log").join(" ");
  if (!input) {
    console.log("⛔ Veuillez entrer un message ou utilisez --live pour le mode interactif.");
    process.exit(1);
  }

  (async () => {
    const response = await nsissim.process(input);
    console.log("=== PEGINTI IA ===");
    console.log("Sujet :", response.topic);
    if (response.frame) console.log("Cadre :", response.frame);
    console.log("Réponse :", response.reply);
    if (response.filter) console.log("Filtre :", response.filter);
    logConversation(input, response);
  })();
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "PEGINTI> "
  });

  console.log("=== PEGINTI IA INTERACTIF ===");
  console.log("Tapez vos messages. Utilisez Ctrl+C pour quitter.\n");
  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    if (input.length === 0) {
      rl.prompt();
      return;
    }

    const response = await nsissim.process(input);
    console.log("\n=== Réponse PEGINTI IA ===");
    console.log("Sujet :", response.topic);
    if (response.frame) console.log("Cadre :", response.frame);
    console.log("Réponse :", response.reply);
    if (response.filter) console.log("Filtre :", response.filter);
    console.log();
    logConversation(input, response);
    rl.prompt();
  });
}
