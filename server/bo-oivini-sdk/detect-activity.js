const fs = require('fs');

const PegintiDevs = {
  devs: new Map([
    ['dev1', { name: 'Bertrand', lastActivity: Date.now() - 70000 }],
    ['dev2', { name: 'Alice', lastActivity: Date.now() }]
  ]),
  generateAccessCode: (id) => {
    console.log(`🔑 Code d’accès régénéré pour ${id}`);
  }
};

const BoOiviniSDK = {};

BoOiviniSDK.detectDevActivity = () => {
  const now = Date.now();

  // 1. Vérif heartbeat API (1min)
  for (let [devId, dev] of PegintiDevs.devs) {
    if (now - dev.lastActivity > 60000) {
      console.log(`🚫 ${dev.name} INACTIF → LOCK`);
      PegintiDevs.generateAccessCode(devId);
    }
  }

  // 2. Vérif terminal Termux
  try {
    const status = fs.readFileSync('/data/data/com.termux/files/home/.peginti-status', 'utf8');
    if (status.includes('INACTIF')) {
      console.log('🚫 Terminal Peginti inactif');
    }
  } catch (e) {}
};

// Surveillance continue
setInterval(BoOiviniSDK.detectDevActivity, 30000);

