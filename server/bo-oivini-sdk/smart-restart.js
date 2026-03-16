const { execSync } = require('child_process');

const BoOiviniSDK = {};

BoOiviniSDK.smartRestart = () => {
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
};

BoOiviniSDK.smartRestart();
