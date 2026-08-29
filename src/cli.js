#!/usr/bin/env node
/**
 * PEGINTI CLI - Ligne de commande souveraine
 * Utilisation: node src/cli.js "Votre question"
 */

import { raisonner } from './core/matrice.js';
import { IDENTITE_PEGINTI } from './identite.js';

async function main() {
  const args = process.argv.slice(2);
  const prompt = args.join(' ').trim() || 'Bonjour';

  console.log(`\n👑 ${IDENTITE_PEGINTI.nom} (${IDENTITE_PEGINTI.version}) - CLI Souverain`);
  console.log(`⚡ Concepteur: ${IDENTITE_PEGINTI.concepteur} (${IDENTITE_PEGINTI.organisation})\n`);
  console.log(`🔍 Requête : "${prompt}"\n`);

  try {
    const resultat = await raisonner(prompt, { vitrine: 'CLI' });
    console.log(`🧠 Réponse :\n\n${resultat.reponse || resultat.narration}\n`);
  } catch (err) {
    console.error(`❌ Erreur d'exécution:`, err.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
