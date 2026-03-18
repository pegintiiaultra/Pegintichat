'use strict';

const readline = require("readline");
const peginti = require("./src/peginti");

console.log("🧠 PEGINTI ULTRA v2.0 — Mode interactif terminal");
console.log("=================================================\n");
console.log("Tape 'quit' ou Ctrl+C pour sortir.\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "💭 Vous: "
});

rl.prompt();

rl.on("line", (line) => {
  const q = line.trim().toLowerCase();

  if (["quit", "exit", "bye"].includes(q)) {
    console.log("👋 PEGINTI: Au revoir, souverain !");
    process.exit(0);
  }

  const result = peginti.analyse(line.trim(), { user_view: "Conscience institutionnelle 🇨🇲" });

  console.log("\n🧠 PEGINTI →");
  console.log(result.response.reponse || result.response.response);
  console.log("");

  rl.prompt();
});
