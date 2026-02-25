'use strict';
const fs = require('fs');
const path = require('path');

class Peginti {
  constructor() {
    this.modules = new Map();
    this.loadModules();
    console.log('🧠 PEGINTI ULTRA → Modules:', Array.from(this.modules.keys()));
  }

  loadModules() {
    const modulesDir = path.join(__dirname, 'modules');
    if (!fs.existsSync(modulesDir)) return console.log('⚠️ modules/ absent');

    fs.readdirSync(modulesDir).forEach(file => {
      if (file.endsWith('.js')) {
        const moduleName = path.basename(file, '.js');
        try {
          this.modules.set(moduleName, require(path.join(modulesDir, file)));
          console.log(`✅ ${moduleName}`);
        } catch(e) {
          console.error(`❌ ${file}:`, e.message);
        }
      }
    });
  }

  analyse(question, context = {}) {
    const domain = this.detectDomain(question);
    const module = this.modules.get(domain) || this.modules.get('core');
    
    // BO'OIVINI supervision (si présent)
    let response = module.analyse({question}, context);
    if (this.modules.has('booivini')) {
      response = this.modules.get('booivini').supervise(response, {question, domain});
    }
    
    return {
      peginti: 'v2.0-ultra',
      timestamp: new Date().toISOString(),
      domain,
      module_used: domain,
      response
    };
  }

  detectDomain(question) {
    const q = question.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (q.includes('peginti') || q.includes("c'est quoi") || q.includes('qui es')) return 'core';
    if (q.includes('strateg') || q.includes('plan') || q.includes('croiss')) return 'strat';
    if (q.includes('bible') || q.includes('foi') || q.includes('verset')) return 'bip';
    if (q.includes("bo'oivini") || q.includes('booivini') || q.includes('matrice')) return 'booivini';
    
    return 'strat';
  }
}

module.exports = new Peginti();
