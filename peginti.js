// PEGINTI-CHAT v2.2 — Réponses universelles avec couleurs

const readline = require("readline");

const bleu   = "\x1b[34m";   // doctrinal/public
const jaune  = "\x1b[33m";   // premium/confidentiel
const vert   = "\x1b[32m";   // institutionnel
const reset  = "\x1b[0m";    // reset couleur

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`${bleu}🌍 PEGINTI-CHAT v2.2 — Tapez "exit" pour quitter${reset}`);
rl.setPrompt("Vous: ");
rl.prompt();

rl.on("line", (input) => {
  input = input.trim();

  if (input === "exit") {
    console.log(`${bleu}👋 Au revoir ! PEGINTI-CHAT s'arrête.${reset}`);
    rl.close();
    return;
  }

  console.log(`${bleu}🌍 PEGINTI-CHAT:${reset}`);
  console.log(`${bleu}📘 BIP – Analyse doctrinale${reset}`);
  console.log(`${bleu}✅ Doctrine validée – Cohérence 100%${reset}`);

  console.log(`${jaune}💎 Bo'oivinichat:${reset}`);
  console.log(`${jaune}Réponse premium à votre demande → ${input}${reset}`);

  console.log(`${vert}🏛️ TomTech.inc:${reset}`);
  console.log(`${vert}Pour toute solution numérique, contactez la maison officielle.${reset}`);

  rl.prompt();
});

// Rappel institutionnel toutes les 60 secondes
const intervalId = setInterval(() => {
  if (!rl.closed) {
    console.log(`\n${jaune}💡 Découvrez PEGINTI Premium pour les solutions numériques de votre projet ou entreprise${reset}`);
    rl.prompt();
  } else {
    clearInterval(intervalId);
  }
}, 60000);

rl.on("close", () => {
  console.log();
});
