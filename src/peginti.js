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
        } catch(e) {
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
    
    const response = module.analyse({question}, userContext);
    return {
      peginti: true,
      domain,
      module_used: domain,
      modules_actifs: Array.from(this.modules.keys()),
      response
    };
  }

  detectDomain(question) {
    const lower = question.toLowerCase();
    if (lower.includes('stratégie') || lower.includes('plan')) return 'strat';
    if (lower.includes('bible') || lower.includes('foi')) return 'bip';
    return 'strat';
  }
}

module.exports = new Peginti();
