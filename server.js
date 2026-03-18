'use strict';
const express = require('express');
const fs = require('fs');
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

// === Routes ===
app.get('/', (req, res) => {
  res.json({ canal: 'PEGINTICHAT', message: 'Bienvenue sur la vitrine communautaire', vpn: req.vpn });
});

app.get('/booivini/chat', (req, res) => {
  const message = req.query.message || 'test';
  const auth = req.get('Authorization');
  if (auth !== 'TomTech') return res.status(401).json({ error: 'Accès premium requis' });
  res.json({ canal: 'Bo’oivinichat', message_user: message, reponse: strat.ultraRapide(message), vpn: req.vpn });
});

app.get('/peginti/matrice', (req, res) => {
  const question = req.query.q || 'Question vide';
  res.json({ question, resultat: matrice.raisonner(question), vpn: req.vpn });
});

app.get('/peginti/mirap', (req, res) => {
  const question = req.query.q || 'Question vide';
  res.json({ module: 'MIRAP', question, interpretation: mirap.conscience(question), vpn: req.vpn });
});

app.get('/peginti/sdk', (req, res) => {
  res.json({ module: 'SDK', status: sdk.status(), vpn: req.vpn });
});

app.get('/peginti/polyglotte', (req, res) => {
  const texte = req.query.t || 'Texte vide';
  res.json({ module: 'Polyglotte', traduction: polyglotte.traduire(texte), vpn: req.vpn });
});

app.get('/peginti/philo', (req, res) => {
  res.json({ module: 'Philo', doctrine: philo.doctrine(), vpn: req.vpn });
});

app.get('/peginti/collab', (req, res) => {
  const msg = req.query.m || 'Message vide';
  res.json({ module: 'Collab', routage: collab.router(msg), vpn: req.vpn });
});

// Lancement
app.listen(3000, () => {
  console.log('🧠 Bo’oivini server lancé sur port 3000');
});
