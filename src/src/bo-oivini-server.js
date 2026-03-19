'use strict';
const express = require('express');
const { cpus } = require('os');
const cluster = require('cluster');

if (cluster.isMaster) {
  console.log('🧠 BO\'OIVINI CERVEAU CENTRAL - Cluster master (PID:', process.pid, ')');
  cpus().forEach(() => cluster.fork());
  cluster.on('exit', (worker) => {
    console.log('Worker', worker.process.pid, 'died - Restarting...');
    cluster.fork();
  });
} else {
  const app = express();
  app.use(express.json());

  // 🔌 Matrice complète (NSISIM + Raisonnement + Logique)
  app.use('/matrice', require('./matrice/index.js'));

  // 👁️✅ Bip (supervision)
  app.use('/bip', require('./bip/index.js'));

  // 📦 Modules plug-and-play
  app.use('/modules', express.Router()
    .use('/essooi-vpn', require('./modules/essooi-vpn/index.js'))
    .use('/sdk', require('./modules/sdk/index.js'))
    .use('/polyglotte', require('./modules/polyglotte/index.js'))
    .use('/hermenutique', require('./modules/hermenutique/index.js'))
    .use('/wounanet', require('./modules/wounanet/index.js'))
    .use('/ghost-pilote', require('./modules/ghost-pilote/index.js'))
  );

  // 🧠 Status cerveau
  app.get('/status', (req, res) => res.json({
    cerveau: 'BO\'OIVINI v1.0',
    matrice: 'NSISIM + Raisonnement + Logique (100%)',
    bip: '👁️✅ Active',
    modules: '6 prêts (plug-and-play)',
    cluster: { workers: cluster.worker ? 'Online' : 'Master', pid: process.pid },
    status: 'SOUVERAINE 🇨🇲'
  }));

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log('🧠 BO\'OIVINI online sur port', PORT, '(Worker PID:', process.pid, ')'));
}
