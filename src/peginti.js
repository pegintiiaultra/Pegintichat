'use strict';
const fs = require('fs');
const path = require('path');

class Peginti {
  constructor() {
    this.modules = new Map();
    this.loadModules();
  }

  loadModules() {
    const modulesDir = path.join(__dirname, 'modules');
    if (!fs.existsSync(modulesDir)) return;

    fs.readdirSync(modulesDir).forEach(file => {
      if (file.endsWith('.js')) {
        try {
          const moduleName = path.basename(file, '.js');
          const module = require(path.join(modulesDir, file));
          this.modules.set(moduleName, module);
          console.log(`✅ PEGINTI → ${moduleName} chargé`);
        } catch(e) {
          console.error(`❌ ${file}:`, e.message);
        }
      }
    });
    console.log('🧠 Modules:', Array.from(this.modules.keys()));
  }

  analyse(question, context = {}) {
    // 1. Détection domaine
    const domain = this.detectDomain(question);
    
    // 2. Module primaire
    const primaryModule = this.modules.get(domain) || this.modules.get('core');
    let response = primaryModule.analyse({question}, context);
    
    // 3. SUPERVISION BO'OIVINI OBLIGATOIRE
    if (this.modules.has('booivini')) {
      const boOivini = this.modules.get('booivini');
      response = boOivini.supervise(response, {question, domain, context});
    }
    
    return {
      peginti: true,
      domain,
      module_used: domain,
      supervision: this.modules.has('booivini') ? 'BO\'OIVINI active' : 'none',
      response
    };
  }

  detectDomain(question) {
    const normalize = (str) => str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/'/g, "'").replace(/[^a-z0-9' ]/g, " ")
      .replace(/\s+/g, " ").trim();

    const q = normalize(question);

    // CORE (priorité 1)
    if (q.includes("peginti") || q.includes("cest quoi") || q.includes("qui es")) return "core";
    
    // STRAT (priorité 2)
    if (q.includes("strategie") || q.includes("plan") || q.includes("business")) return "strat";
    
    // BIP (priorité 3)
    if (q.includes("bible") || q.includes("foi") || q.includes("verset")) return "bip";
    
    return "strat";
  }
}

module.exports = new Peginti();
