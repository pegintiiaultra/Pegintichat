#!/usr/bin/env node

'use strict';

const fs = require("fs");
const readline = require("readline");
const path = require("path");

// === Modules PEGINTI ===
const Memory = require("./core/memory");
const Filters = require("./core/filters");
const Nsissim = require("./core/nsissim");
const Wounanet = require("./core/wounanet");

// Charger la doctrine JSON
const doctrine = require("../data/doctrine.json");

// Instances
const memory = new Memory();
const filters = new Filters();
const wounanet = new Wounanet();
const nsissim = new Nsissim(memory, filters, wounanet, doctrine);

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
    console.log("Cadre :", response.frame);
    console.log("Réponse :", response.reply);
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
    console.log("Cadre :", response.frame);
    console.log("Réponse :", response.reply);
    console.log();
    logConversation(input, response);
    rl.prompt();
  });
}
