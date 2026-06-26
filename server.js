'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');

const matrice = require('./src/matrice');
const pib = require('./src/pib');

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   GHOST MONITOR
========================= */
function ghostMonitor(req, res, next) {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
  console.log(log);

  try {
    fs.appendFileSync(
      path.join(__dirname, 'boivini.log'),
      log + '\n',
      'utf8'
    );
  } catch (e) {
    console.error(e.message);
  }

  next();
}

app.use(ghostMonitor);

/* =========================
   EXPRESS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   INTERFACE WEB
========================= */
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* =========================
   STATUS
========================= */
app.get('/status', (req, res) => {
  res.json({
    serveur: 'online',
    matrice: 'online',
    pib: 'online',
    version: '3.0.0',
    timestamp: new Date().toISOString()
  });
});

/* =========================
   PING
========================= */
app.get('/ping', (req, res) => {
  res.json({
    status: 'ok',
    message: 'pong'
  });
});

/* =========================
   CHAT PEGINTI IA
========================= */
app.post('/api/chat', async (req, res) => {
  try {
    const sujet = String(req.body.sujet || '').trim();
    if (!sujet) {
      return res.status(400).send('Sujet requis');
    }

    const intention = await matrice.scanner(sujet);
    const donnees = await pib.rechercher(intention);
    const reponse = await matrice.finaliser(intention, donnees);

    // Réponse en texte pur
    res.type('text/plain').send(reponse);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne PEGINTI IA');
  }
});

/* =========================
   WOUNANET DIRECT
========================= */
app.get('/api/wounanet', async (req, res) => {
  try {
    const sujet = String(req.query.sujet || '').trim();
    const resultat = await pib.collecteWounanet(sujet);
    res.json(resultat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   MODULES
========================= */
app.get('/modules', (req, res) => {
  res.json({
    matrice: true,
    pib: true,
    architecture: 'Serveur -> Matrice -> PIB -> Modules -> Memoire -> WOUNANET'
  });
});

/* =========================
   HEALTH
========================= */
app.get('/health', (req, res) => {
  const memory = process.memoryUsage();
  res.json({
    uptime: process.uptime(),
    rss: memory.rss,
    heapUsed: memory.heapUsed,
    heapTotal: memory.heapTotal
  });
});

/* =========================
   ERREUR 404
========================= */
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

/* =========================
   ERREUR GLOBALE
========================= */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne PEGINTI IA' });
});

/* =========================
   DEMARRAGE
========================= */
app.listen(PORT, () => {
  console.log('');
  console.log('🧠 PEGINTI IA');
  console.log('🚀 Serveur Orchestrateur actif');
  console.log('🎯 Matrice Bo\'oivini active');
  console.log('⚡ PIB Scanner actif');
  console.log(`🌐 Port : ${PORT}`);
  console.log('');
});
