'use strict';
const fs = require('fs');
const path = require('path');

class Peginti {
  constructor() {
    this.modules = new Map();
    console.log('🧠 PEGINTI → Initialisation du noyau…');
    this.loadModules();
    console.log('🧠 PEGINTI → Modules actifs:', Array.from(this.modules.keys()));
  }

  loadModules() {
    const modulesDir = path.join(__dirname, 'modules');
    console.log('🔍 PEGINTI → Chargement des modules depuis:', modulesDir);

    if (!fs.existsSync(modulesDir)) {
      console.log('❌ PEGINTI → Dossier modules/ introuvable');
      return;
    }

    const files = fs.readdirSync(modulesDir);
    console.log('📁 PEGINTI → Fichiers détectés:', files);

    files.forEach(file => {
      if (file.endsWith('.js')) {
        try {
          const moduleName = path.basename(file, '.js');
          const modulePath = path.join(modulesDir, file);
          const module = require(modulePath);

          if (typeof module.analyse !== 'function') {
            console.log(`⚠️ PEGINTI → Module ${moduleName} ignoré (pas de analyse())`);
            return;
          }

          this.modules.set(moduleName, module);
          console.log(`✅ PEGINTI → Module ${moduleName} chargé`);
        } catch (e) {
          console.error(`❌ PEGINTI → Erreur dans ${file}:`, e.message);
        }
      }
    });
  }

  analyse(data, userContext = {}) {
    const question = (data.question || "").toLowerCase();
    console.log('🧠 PEGINTI → Analyse:', question);

    const domain = this.detectDomain(question);
    console.log('🧠 PEGINTI → Domaine détecté:', domain);

    const module = this.modules.get(domain);

    if (!module) {
      console.log('❌ PEGINTI → Module introuvable, fallback BIP');
      return {
        peginti: true,
        domain: "bip",
        module_used: "bip",
        modules_actifs: Array.from(this.modules.keys()),
        response: this.modules.get("bip")?.analyse(data, userContext) || { error: "Module BIP manquant" }
      };
    }

    const response = module.analyse(data, userContext);

    return {
      peginti: true,
      domain,
      module_used: domain,
      modules_actifs: Array.from(this.modules.keys()),
      response
    };
  }

  detectDomain(question) {
    const q = question.toLowerCase();

    // CORE — Identité PEGINTI
    if (
      q.includes('peginti') ||
      q.includes('cest quoi') ||
      q.includes('c’est quoi') ||
      q.includes('qui es tu') ||
      q.includes('mission') ||
      q.includes('vision') ||
      q.includes('origine') ||
      q.includes('identité') ||
      q.includes('pegintichat') ||
      q.includes('bo’oivini') ||
      q.includes('bo oivini') ||
      q.includes('peginti237') ||
      q.includes('tomtech')
    ) return 'core';

    // STRAT — Stratégie
    if (
      q.includes('stratégie') ||
      q.includes('plan') ||
      q.includes('business') ||
      q.includes('entreprise') ||
      q.includes('croissance')
    ) return 'strat';

    // BIP — Doctrine
    if (
      q.includes('bible') ||
      q.includes('verset') ||
      q.includes('foi') ||
      q.includes('église')
    ) return 'bip';

    // Fallback STRAT
    return 'strat';
  }
}

module.exports = new Peginti();
