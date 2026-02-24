<<<<<<< HEAD
const app = require("./api/server");
=======
'use strict';
const fs = require('fs');
const path = require('path');

class Peginti {
  constructor() {
    this.modules = new Map();
    console.log('🧠 PEGINTI → Scan modules:', path.join(__dirname, 'modules'));
    this.loadModules();
    console.log('🧠 PEGINTI → Modules loaded:', Array.from(this.modules.keys()));
  }

  loadModules() {
    const modulesDir = path.join(__dirname, 'modules');
    console.log('🔍 PEGINTI → modulesDir existe?', fs.existsSync(modulesDir));

    if (!fs.existsSync(modulesDir)) {
      console.log('❌ PEGINTI → modules/ manquant');
      return;
    }

    const files = fs.readdirSync(modulesDir);
    console.log('📁 PEGINTI → Fichiers trouvés:', files);

    files.forEach(file => {
      if (file.endsWith('.js')) {
        try {
          const moduleName = path.basename(file, '.js');
          const modulePath = path.join(modulesDir, file);
          const module = require(modulePath);
          this.modules.set(moduleName, module);
          console.log(`✅ PEGINTI → Module ${moduleName} chargé`);
        } catch (e) {
          console.error(`❌ PEGINTI → Erreur ${file}:`, e.message);
        }
      }
    });
  }

  analyse(question, userContext = {}) {
    console.log('🧠 PEGINTI → Analyse:', question);
    const domain = this.detectDomain(question);
    console.log('🧠 PEGINTI → Domaine:', domain);

    const module = this.modules.get(domain) || this.modules.get('bip');
    if (!module) {
      return { error: 'Aucun module disponible', modules: Array.from(this.modules.keys()) };
    }

    const response = module.analyse({ question }, userContext);
    return {
      peginti: true,
      domain,
      module_used: domain,
      modules_actifs: Array.from(this.modules.keys()),
      response
    };
  }

  detectDomain(question) {
    // Normalisation robuste
    const normalize = (str) => str
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // retire accents
      .replace(/'/g, "'") // remplace apostrophe typographique
      .replace(/[^a-z0-9' ]/g, " ") // retire caractères spéciaux
      .replace(/\s+/g, " ") // espaces propres
      .trim();
>>>>>>> 41de460 (PEGINTI v2.0 → CORE bip strat 3 modules actifs)

const PORT = 4000;

<<<<<<< HEAD
// Lancement du serveur PEGINTI IA
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 PEGINTI IA lancé sur port", PORT);
});
=======
    // CORE — Identité PEGINTI (PRIORITÉ 1)
    if (
      q.includes("peginti") ||
      q.includes("cest quoi") ||
      q.includes("c est quoi") ||
      q.includes("definition peginti") ||
      q.includes("qui es tu") ||
      q.includes("qui es tu") ||
      q.includes("presentation peginti") ||
      q.includes("peginti cest quoi")
    ) return "core";

    // STRAT (PRIORITÉ 2)
    if (
      q.includes("strategie") ||
      q.includes("plan") ||
      q.includes("business") ||
      q.includes("entreprise") ||
      q.includes("croissance")
    ) return "strat";

    // BIP (PRIORITÉ 3)
    if (
      q.includes("bible") ||
      q.includes("verset") ||
      q.includes("foi") ||
      q.includes("eglise")
    ) return "bip";

    // Fallback
    return "strat";
  }
}

module.exports = new Peginti();
>>>>>>> 41de460 (PEGINTI v2.0 → CORE bip strat 3 modules actifs)
