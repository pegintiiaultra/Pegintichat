'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

const wounanet = require('./services/wounanet');
const matrice = require('./matrice/index.js');
const bip = require('./moteur/bip.js');

const VERSION = '3.0.0';
const PORT = process.env.PORT || 3000;

// Correction : public dans src/public
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const MEM_FILE = path.join(DATA_DIR, 'memoire.json');
const DOCTRINE_FILE = path.join(DATA_DIR, 'doctrine.json');

function ensureFile(file, initialContent) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, initialContent, 'utf8');
}

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  ensureFile(MEM_FILE, '[]');
  ensureFile(DOCTRINE_FILE, '{}');
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function loadMemoire() {
  return readJson(MEM_FILE, []);
}

async function saveMemoire(entry) {
  const memoire = loadMemoire();
  memoire.push(entry);
  await fsp.writeFile(MEM_FILE, JSON.stringify(memoire, null, 2), 'utf8');
}

const app = express();

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/status', (req, res) => {
  res.json({
    service: 'PEGINTICHAT',
    version: VERSION,
    status: 'ONLINE',
    uptime: process.uptime(),
    pid: process.pid
  });
});

app.get('/memoire', (req, res) => {
  res.json(loadMemoire());
});

app.get('/api/wounanet', async (req, res) => {
  try {
    const sujet = String(req.query.sujet || 'Afrique').trim();
    const result = await wounanet.search(sujet);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const sujet = String(req.body.sujet || '').trim();
    if (!sujet) return res.status(400).json({ error: 'Sujet requis' });

    const moduleTrouve = bip.scan(sujet);
    const memoire = loadMemoire();
    const actualites = await wounanet.search(sujet);
    const logique = matrice.raisonner(sujet, {
      module: moduleTrouve,
      memoire,
      actualites
    });

    const narration = (moduleTrouve && moduleTrouve.narration) ? moduleTrouve.narration : logique;

    const texteFinal = `
${narration?.reponse || ''}
${narration?.developpement || ''}
${narration?.conclusion || ''}
    `.trim();

    const entry = {
      sujet,
      narration: texteFinal,
      actualites,
      souveraine: true,
      timestamp: new Date().toISOString()
    };

    await saveMemoire(entry);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

ensureStorage();
app.listen(PORT, () => {
  console.log(`🚀 PEGINTICHAT V${VERSION} sur port ${PORT}`);
  console.log('🧠 CHAT : ACTIF');
  console.log('🌍 WOUNANET : ACTIF');
  console.log('💾 MEMOIRE : ACTIVE');
});
