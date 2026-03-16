const crypto = require('crypto');

const PegintiDevs = {
  devs: new Map(),  // ID → {name, lastActivity, token}
  
  // 📝 Enregistrement développeur
  registerDev: (devId, name) => {
    const token = crypto.randomBytes(16).toString('hex');
    PegintiDevs.devs.set(devId, {
      name,
      lastActivity: Date.now(),
      token,
      machines: []
    });
    return token;
  },
  
  // ⏱️ Détection inactivité
  checkInactivity: () => {
    const now = Date.now();
    const inactive = [];
    
    for (let [devId, dev] of PegintiDevs.devs) {
      if (now - dev.lastActivity > 60000) {  // 1 minute
        const code = PegintiDevs.generateAccessCode(dev.name);
        inactive.push({ devId, dev: dev.name, code });
        dev.locked = true;
      }
    }
    return inactive;
  },
  
  // 🔢 Code d'accès unique
  generateAccessCode: (devName) => {
    const hash = crypto.createHash('sha256')
      .update(devName + Date.now())
      .digest('hex').slice(0, 8).toUpperCase();
    return `PEG${hash}`;
  },
  
  // 🔓 Déverrouillage
  unlock: (devId, token) => {
    const dev = PegintiDevs.devs.get(devId);
    if (dev && dev.token === token) {
      dev.locked = false;
      dev.lastActivity = Date.now();
      return true;
    }
    return false;
  }
};

module.exports = { PegintiDevs };
