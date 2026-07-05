'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// === Modules internes PEGINTICHAT ===
const matrice = require('./modules/matrice');
const sdk = require('./modules/sdk');
const polyglotte = require('./modules/polyglotte');
const philo = require('./modules/philo');
const strat = require('./modules/strat');
const mirap = require('./modules/mirap');
const collab = require('./modules/collab');

// === WOUNANET (connecteur externe) ===
const wounanet = require('./src/wounanet');

// === Ghost : surveillance permanente ===
function ghostMonitor(req, res, next) {
  const logEntry = `[INFO] ${new Date().toISOString()} → ${req.method} ${req.url}`;
  console.log(logEntry);
  fs.appendFileSync('boivini.log', logEntry + '\n', 'utf8');
  next();
}
app.use(ghostMonitor);

// === ESSO’OÏ VPN : gratuit vs premium ===
function essooiVPN(req, res, next) {
  req.vpn = { type: 'gratuit', secure: true };
  const auth = req.get('Authorization');
  if (auth === 'TomTech') {
    req.vpn = { type: 'premium', secure: true, ultra: true, speed: 'rapide' };
  }
  const logEntry = `[INFO] ${new Date().toISOString()} → ESSO'OÏ VPN actif (${req.vpn.type})`;
  console.log(logEntry);
  fs.appendFileSync('boivini.log', logEntry + '\n', 'utf8');
  next();
}
app.use(essooiVPN);

// === Middleware JSON pour POST ===
app.use(express.json());

// === Servir les fichiers statiques (interface PEGINTICHAT) ===
app.use(express.static(path.join(__dirname)));

// Route principale : renvoie index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === API Public ===
app.get('/api/public', (req, res) => {
  res.json({
    canal: "PEGINTICHAT",
    message: "Bienvenue sur la vitrine communautaire",
    vpn: req.vpn
  });
});

// === API Premium (Bo’oivini chat) ===
app.get('/booivini/chat', (req, res) => {
  const msg = req.query.message || "Message vide";
  res.send(`Réponse premium à: ${msg}`);
});

// === WOUNANET : moteur de recherche actualités ===
app.get('/api/wounanet', async (req, res) => {
  const sujet = req.query.sujet || req.query.q || '';
  if (!sujet) {
    return res.status(400).json({ error: 'Sujet manquant pour la requête Wounanet' });
  }
  try {
    const result = await wounanet.searchDirect(sujet);
    res.json(result);
  } catch (err) {
    console.error(`[WOUNANET ERROR] ${err.message}`);
    res.status(500).json({ error: 'Erreur interne Wounanet', details: err.message });
  }
});

// === CHAT doctrinal (POST) ===
app.post('/api/chat', async (req, res) => {
  const sujet = req.body.sujet || '';
  if (!sujet) {
    return res.status(400).json({ error: "Sujet manquant pour le chat doctrinal" });
  }

  // Exemple de narration doctrinale simple
  const reponse = {
    status: "ok",
    sujet,
    intention: "doctrinal",
    reponse: {
      introduction: `Le sujet de "${sujet}" est fondamental pour la stabilité sociale.`,
      developpement: `La paix et la cohésion sociale reposent sur la justice, la solidarité et la reconnaissance mutuelle. Elles permettent aux communautés de dépasser les conflits et de construire un avenir commun.`,
      conclusion: `Ainsi, "${sujet}" demeure une exigence permanente pour toute société qui aspire à l'équilibre et au progrès.`
    },
    timestamp: new Date().toISOString()
  };

  res.json(reponse);
});

// === Diagnostic : ping ===
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', message: 'pong' });
});

// === Diagnostic : status global ===
app.get('/status', (req, res) => {
  res.json({
    pegintichat: 'online',
    bo_oivini: 'online',
    tunnel: 'online',
    timestamp: new Date().toISOString()
  });
});

// === Diagnostic : santé système ===
app.get('/health', (req, res) => {
  const memory = process.memoryUsage();
  const cpu = process.cpuUsage();
  res.json({
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed
    },
    cpu: cpu,
    uptime: process.uptime()
  });
});

// === Diagnostic : modules actifs ===
app.get('/modules', (req, res) => {
  res.json({
    matrice: typeof matrice !== 'undefined',
    sdk: typeof sdk !== 'undefined',
    polyglotte: typeof polyglotte !== 'undefined',
    philo: typeof philo !== 'undefined',
    strat: typeof strat !== 'undefined',
    mirap: typeof mirap !== 'undefined',
    collab: typeof collab !== 'undefined',
    wounanet: typeof wounanet !== 'undefined'
  });
});

// === Gestion des erreurs globales ===
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} → ${err.message}`);
  res.status(500).json({ error: 'Erreur interne PEGINTICHAT', details: err.message });
});

// === Lancement du serveur ===
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🧠 PEGINTICHAT server lancé sur port ${PORT}`);
});
