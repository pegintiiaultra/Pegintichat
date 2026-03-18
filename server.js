'use strict';
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// === Modules internes PEGINTI ===
const matrice = require('./modules/matrice');
const sdk = require('./modules/sdk');
const polyglotte = require('./modules/polyglotte');
const philo = require('./modules/philo');
const strat = require('./modules/strat');
const mirap = require('./modules/mirap');
const collab = require('./modules/collab');

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

// === Lancement du serveur ===
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🧠 Bo’oivini server lancé sur port ${PORT}`);
});
