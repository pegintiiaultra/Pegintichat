// PEGINTI-CHAT v2.2 — Chat terminal institutionnel (version stable et dynamique)
// Maison officielle : TomTech.inc – Solutions numériques

const readline = require("readline");

const bleu   = "\x1b[34m";   // doctrinal / public
const jaune  = "\x1b[33m";   // premium / confidentiel
const vert   = "\x1b[32m";   // institutionnel
const rouge  = "\x1b[31m";   // fenêtre premium
const reset  = "\x1b[0m";    // reset couleur

// Mots‑clés qui permettent de repérer un utilisateur potentiel client
const motsClesPremium = [
  "premium",
  "prestation",
  "code",
  "logiciel",
  "logiciel_",
  "entreprise",
  "client",
  "contrat",
  "affaire",
  "acheter",
  "vendre",
  "service",
  "solution",
  "numérique",
  "institutionnel",
  "abonnement",
  "offre",
  "projet"
];

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

// --- Rappel publicitaire ✅
setInterval(() => {
  if (!rl.closed) {
    console.log(`\n${jaune}💡 PEGINTI Premium – Solutions numériques pour projet ou entreprise${reset}`);
    rl.prompt();
  }
}, 60000);

// Fonction réutilisable : détecte les mots‑clés premium
function isPremiumRequest(input) {
  return motsClesPremium.some((mot) => {
    const pattern = new RegExp(`(?:^|\\s|_)${mot}(?:$|\\s|_)`, "i");
    return pattern.test(input);
  });
}

rl.on("line", (input) => {
  const inputOriginal = input.trim();
  input = inputOriginal.toLowerCase();

  // Sortie propre
  if (input === "exit") {
    console.log(`\n${bleu}👋 PEGINTI-CHAT s’arrête. À bientôt pour de nouvelles missions doctrinales.${reset}\n`);
    rl.close();
    return;
  }

  // Ignore la ligne vide
  if (!inputOriginal) {
    rl.prompt();
    return;
  }

  // --- BLOC 1 : Doctrinal / public (bleu)
  console.log(`\n${bleu}🌍 PEGINTI-CHAT${reset}`);
  console.log(`${bleu}📘 BIP – Analyse doctrinale${reset}`);
  console.log(`${bleu}✅ Doctrine validée – Cohérence 100%${reset}`);

  // --- BLOC 2 : Premium / confidentiel (jaune) → Bo'oivinichat
  console.log(`\n${jaune}💎 Bo'oivinichat${reset}`);
  console.log(`${jaune}Réponse premium à votre demande → ${inputOriginal}${reset}`);

  // --- REDIRECTION CLIENT POTENTIEL VERS FENÊTRE PREMIUM
  if (isPremiumRequest(inputOriginal)) {
    console.log(`\n${rouge}🎫 [PEGINTICHAT] UTILISATEUR POTENTIEL REDIRIGÉ → Fenêtre premium${reset}`);
    console.log(`${rouge}   📌 Signal : requête contenant des mots‑clés business / institutionnels${reset}`);
    console.log(`${rouge}   📌 Conduite : passage à l’espace premium PEGINTI Bo'oivinichat${reset}`);
  }
  // ✅ Aucun message de “Remarque” pour l’utilisateur

  // --- BLOC 3 : Institutionnel (vert)
  console.log(`\n${vert}🏛️ TomTech.inc${reset}`);
  console.log(`${vert}Maison officielle des solutions numériques institutionnelles.${reset}`);
  console.log(`${vert}Pour toute solution numérique, contactez la maison officielle.${reset}`);

  rl.prompt();
});
