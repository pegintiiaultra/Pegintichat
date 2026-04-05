#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "history.log");

if (!fs.existsSync(LOG_PATH)) {
  console.log("⛔ Aucun historique trouvé.");
  process.exit(1);
}

const content = fs.readFileSync(LOG_PATH, "utf-8").trim();
if (!content) {
  console.log("📂 L'historique est vide.");
  process.exit(0);
}

const args = process.argv.slice(2);
const keyword = args.find(a => !a.startsWith("--date"));
const dateFilter = args.find(a => a.startsWith("--date"));

const entries = content.split("\n[").map(e => (e.startsWith("[") ? e : "[" + e));

let filtered = entries;
if (keyword) {
  filtered = filtered.filter(e => e.toLowerCase().includes(keyword.toLowerCase()));
}
if (dateFilter) {
  const date = dateFilter.replace("--date=", "");
  filtered = filtered.filter(e => e.includes(date));
}

console.log("=== HISTORIQUE PEGINTI IA ===\n");
console.log(filtered.join("\n"));
