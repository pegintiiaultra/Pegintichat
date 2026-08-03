'use strict';
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

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

// === Route de contrôle serveur ===
app.get('/status', (req, res) => {
  res.json({
    ok: true,
    service: "PEGINTI-Framework",
    vpn: req.vpn,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// === Routes principales ===
app.get('/', (req, res) => {
  res.json({ canal: 'PEGINTICHAT', message: 'Bienvenue sur la vitrine communautaire', vpn: req.vpn });
});

app.post('/api/chat', (req, res) => {
  const sujet = req.body.sujet || 'vide';
  res.json({ canal: 'Bo’oivinichat', message_user: sujet, reponse: "Réponse simulée", vpn: req.vpn });
});

app.post('/api/wounanet', (req, res) => {
  const sujet = req.body.sujet || 'vide';
  try {
    // Simuler une recherche Wounanet
    res.json({ module: 'Wounanet', resultat: `Résultats simulés pour: ${sujet}`, vpn: req.vpn });
  } catch (err) {
    console.error("❌ Erreur API WOUNANET:", err.message);
    res.status(500).json({ error: "Wounanet indisponible", vpn: req.vpn });
  }
});

// === Lancement du serveur ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PEGINTI-Framework lancé sur http://0.0.0.0:${PORT}`);
});
