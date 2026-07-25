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

// === Routes principales ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// === API Public (Chat interactif IA) ===
app.post('/api/chat', async (req, res) => {
  const sujet = req.body.sujet || '';
  if (!sujet) {
    return res.status(400).json({ error: "Sujet manquant pour le chat public" });
  }

  const reponse = {
    status: "ok",
    sujet,
    canal: "PEGINTICHAT Public",
    vpn: req.vpn,
    reponse: {
      introduction: `Le sujet "${sujet}" est essentiel pour la communauté.`,
      developpement: `La cohésion sociale repose sur la justice, la solidarité et la reconnaissance mutuelle. Ces valeurs permettent de dépasser les conflits et de construire un avenir commun.`,
      conclusion: `Ainsi, "${sujet}" demeure une exigence permanente pour toute société qui aspire à l'équilibre et au progrès.`
    },
    timestamp: new Date().toISOString()
  };

  res.json(reponse);
});

// === API Premium (Boutique statique) ===
app.get('/booivini/chat', (req, res) => {
  const msg = req.query.message || "Message vide";
  res.send(`Réponse premium statique à: ${msg}`);
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
    res.json({
      status: "error",
      source: "wounanet",
      sujet,
      message: "Flux indisponible, veuillez réessayer plus tard."
    });
  }
});

// === Diagnostics ===
app.get('/ping', (req, res) => res.json({ status: 'ok', message: 'pong' }));

app.get('/status', (req, res) => {
  res.json({
    pegintichat: 'online',
    booivini: 'online',
    tunnel: 'online',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  const memory = process.memoryUsage();
  const cpu = process.cpuUsage();
  res.json({
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed
    },
    cpu,
    uptime: process.uptime()
  });
});

// === Modules actifs (corrigé) ===
app.get('/api/modules', (req, res) => {
  res.json({
    matrice: !!matrice,
    sdk: !!sdk,
    polyglotte: !!polyglotte,
    philo: !!philo,
    strat: !!strat,
    mirap: !!mirap,
    collab: !!collab,
    wounanet: !!wounanet
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
