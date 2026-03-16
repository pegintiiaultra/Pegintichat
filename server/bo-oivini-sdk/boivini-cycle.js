const { AutoFixer } = require('./auto-fix.js');
const { execSync } = require('child_process');
const fs = require('fs');

// Exemple PegintiDevs pour test
const PegintiDevs = {
  devs: new Map([
    ['dev1', { name: 'Bertrand', lastActivity: Date.now() - 70000 }],
    ['dev2', { name: 'Alice', lastActivity: Date.now() }]
  ]),
  generateAccessCode: (id) => {
    console.log(`🔑 Code d’accès régénéré pour ${id}`);
  }
};

function runAutoFix() {
  const results = AutoFixer.fixAll(['~/NoyauUltra', '~/PEGINTICHAT']);
  console.log("🔄 AutoFixer terminé:", results);
}

function smartRestart() {
  try {
    const status = execSync('pm2 jlist').toString();
    const processes = JSON.parse(status).map(p => p.name);

    ['bo-oivini-sdk', "noyau-ultra-bo'oivini", "pegintichat-bo'oivini"].forEach(proc => {
      if (processes.includes(proc)) {
        execSync(`pm2 restart "${proc}"`);
        console.log(`✅ Relance effectuée pour ${proc}`);
      } else {
        console.log(`⚠️ Processus ${proc} introuvable, ignoré`);
      }
    });
  } catch (err) {
    console.log("⚠️ Relance partielle:", err.message);
  }
}

function detectDevActivity() {
  const now = Date.now();
  for (let [devId, dev] of PegintiDevs.devs) {
    if (now - dev.lastActivity > 60000) {
      console.log(`🚫 ${dev.name} INACTIF → LOCK`);
      PegintiDevs.generateAccessCode(devId);
    }
  }
  try {
    const status = fs.readFileSync('/data/data/com.termux/files/home/.peginti-status', 'utf8');
    if (status.includes('INACTIF')) {
      console.log('🚫 Terminal Peginti inactif');
    }
  } catch(e) {}
}

function boiviniCycle() {
  runAutoFix();
  smartRestart();
  detectDevActivity();
  console.log("🎉 Bo'oivini Cycle: Correction + Relance + Supervision terminées");
}

// Exécution toutes les 30s
setInterval(boiviniCycle, 30000);

