// PEGINTI-CHAT v2.2 — Chat terminal institutionnel (version stable)
// Maison officielle : TomTech.inc – Solutions numériques

const readline = require("readline");

const bleu   = "\x1b[34m";   // doctrinal / public
const jaune  = "\x1b[33m";   // premium / confidentiel
const vert   = "\x1b[32m";   // institutionnel
const reset  = "\x1b[0m";    // reset couleur

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Message d’accueil
console.log(
  `\n${bleu}🌍 PEGINTI-CHAT v2.2 — Votre assistant institutionnel officiel${reset}`
);
console.log(`${bleu}Tapez votre message ou "exit" pour quitter.${reset}\n`);
rl.setPrompt(`\n${bleu}Vous${reset}: `);
rl.prompt();

rl.on("line", (input) => {
  input = input.trim();

  // Sortie propre
  if (input === "exit") {
    console.log(`\n${bleu}👋 PEGINTI-CHAT s’arrête. À bientôt pour de nouvelles missions doctrinales.${reset}\n`);
    rl.close();
    return;
  }

  // Ignore la ligne vide
  if (!input) {
    rl.prompt();
    return;
  }

  // --- BLOC 1 : Doctrinal / public (bleu)
  console.log(`\n${bleu}🌍 PEGINTI-CHAT${reset}`);
  console.log(`${bleu}📘 BIP – Analyse doctrinale${reset}`);
  console.log(`${bleu}✅ Doctrine validée – Cohérence 100%${reset}`);

  // --- BLOC 2 : Premium / confidentiel (jaune)
  console.log(`\n${jaune}💎 Bo'oivinichat${reset}`);
  console.log(`${jaune}Réponse premium à votre demande → ${input}${reset}`);

  // --- BLOC 3 : Institutionnel (vert)
  console.log(`\n${vert}🏛️ TomTech.inc${reset}`);
  console.log(`${vert}Maison officielle des solutions numériques institutionnelles.${reset}`);
  console.log(`${vert}Pour toute solution numérique, contactez la maison officielle.${reset}`);

  rl.prompt();
});

// Rappel institutionnel toutes les 60 secondes
const intervalId = setInterval(() => {
  if (!rl.closed) {
    console.log(`\n${jaune}💡 Découvrez PEGINTI Premium – Solutions numériques pour projet ou entreprise${reset}`);
    rl.prompt();
  } else {
    clearInterval(intervalId);
  }
}, 60000);

rl.on("close", () => {
  console.log();
});
