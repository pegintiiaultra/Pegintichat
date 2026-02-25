'use strict';

const fs = require('fs');
const path = require('path');

/* ---------------------------------------------------------
   ⚙️  MOTEUR PEGINTI — Chargement des modules internes
--------------------------------------------------------- */

class Peginti {
  constructor() {
    this.modules = new Map();

    const modulesDir = path.join(__dirname, 'modules');
    console.log('🧠 PEGINTI → Scan modules:', modulesDir);
    console.log('🔍 PEGINTI → modulesDir existe ?', fs.existsSync(modulesDir));

    if (fs.existsSync(modulesDir)) {
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
            console.log(`❌ PEGINTI → Erreur chargement module ${file}`, e);
          }
        }
      });
    }

    console.log('🧠 PEGINTI → Modules chargés:', Array.from(this.modules.keys()));
  }
}

/* ---------------------------------------------------------
   🧠  CERVEAU PEGINTI — Hémisphère droit + gauche
--------------------------------------------------------- */

const boovini = require('./matrice/booivini.js');
const pegintichat = require('./chat/pegintichat.js');

const cerveau = {
  droit: {
    logique: boovini.logique,
    raisonner: boovini.raisonnement.raisonner
  },
  gauche: {
    exprimerLogique: pegintichat.logique,
    exprimerRaisonnement: pegintichat.raisonner
  }
};

console.log("🧠 Cerveau PEGINTI chargé :", Object.keys(cerveau));

/* ---------------------------------------------------------
   🚀 EXPORT GLOBAL
--------------------------------------------------------- */

module.exports = {
  Peginti,
  cerveau
};
