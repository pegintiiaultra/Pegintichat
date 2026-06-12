'use strict';
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const wounanet = require('./services/wounanet');
const { detecterIntention } = require('./moteur/intentions');
const { extraireContexte } = require('./moteur/contexte');
const { construirePlan } = require('./moteur/raisonnement');
const { formuler } = require('./moteur/formulation');

const app = express();
const PORT = 3000; // ✅ Port fixé à 3000
const HOST = process.env.HOST || '0.0.0.0';
const VERSION = '3.0.0';

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const MEM_FILE = path.join(DATA_DIR, 'memoire.json');
const STATUS_FILE = path.join(DATA_DIR, 'status.json');
const DOCTRINE_FILE = path.join(DATA_DIR, 'doctrine.json');

function ensureFile(file, initialContent) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, initialContent, 'utf8');
  }
}

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  ensureFile(MEM_FILE, '[]');
  ensureFile(DOCTRINE_FILE, '{}');
  ensureFile(STATUS_FILE, '{}');
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

function loadDoctrine() {
  return readJson(DOCTRINE_FILE, {});
}

async function saveMemoire(entry) {
  const memoire = loadMemoire();
  memoire.push(entry);
  await fsp.writeFile(MEM_FILE, JSON.stringify(memoire, null, 2), 'utf8');
}

async function autoUpdate() {
  const status = {
    updatedAt: new Date().toISOString(),
    service: 'PEGINTICHAT',
    version: VERSION,
    status: 'ONLINE'
  };
  await fsp.writeFile(STATUS_FILE, JSON.stringify(status, null, 2), 'utf8');
  console.log('🔄 Auto-update exécuté');
}
function startAutoUpdateLoop() {
  autoUpdate().catch(err => console.error('Auto-update error:', err.message));
  setInterval(() => {
    autoUpdate().catch(err => console.error('Auto-update error:', err.message));
  }, 300000);
}

function normaliserSujet(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ');
}

function safeStep(fn, fallback) {
  try {
    return fn();
  } catch (error) {
    console.error(error.message);
    return fallback;
  }
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(PUBLIC_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/ping', (req, res) => {
  res.status(200).send(`PEGINTICHAT V${VERSION} ONLINE`);
});

app.get('/doctor', (req, res) => {
  res.send(`PEGINTICHAT V${VERSION} — mémoire: ${loadMemoire().length} entrées — ${new Date().toISOString()}`);
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
    res.status(500).send('Erreur: ' + error.message);
  }
});

async function traiterRequete(req, res) {
  try {
    const sujet = String(req.body.sujet || req.body.question || req.body.message || '').trim();
    if (!sujet) return res.status(400).send('Sujet requis');

    const sujetNorm = normaliserSujet(sujet);
    const memoire = loadMemoire();
    const doctrineDB = loadDoctrine();

    const trouve = memoire.find(e => normaliserSujet(e.sujet) === sujetNorm);
    if (trouve?.texte) return res.status(200).send(trouve.texte);

    const texteDoctrine = doctrineDB[sujet] || doctrineDB[sujetNorm];
    if (texteDoctrine) {
      await saveMemoire({
        sujet,
        texte: texteDoctrine,
        source: 'doctrine',
        createdAt: new Date().toISOString(),
        version: VERSION
      });
      return res.status(200).send(texteDoctrine);
    }

    let actualites = { articles: [] };
    try {
      actualites = await wounanet.search(sujet);
    } catch (e) {
      actualites = { articles: [], error: e.message };
    }

    const intention = safeStep(() => detecterIntention(sujet), { type: 'general', confiance: 0 });
    const contexte = safeStep(() => extraireContexte({
      question: sujet,
      memoire,
      doctrine: doctrineDB,
      sources: Array.isArray(actualites?.articles) ? actualites.articles : []
    }), { question: sujet, memoirePertinente: [], doctrineTexte: '', sourceTitles: [], totalSources: 0 });

    const plan = safeStep(() => construirePlan(intention, contexte), [
      'Réponse de secours : le moteur de raisonnement est temporairement indisponible.'
    ]);

    const texte = safeStep(() => formuler({
      question: sujet,
      intention,
      contexte,
      plan
    }), `Réponse indisponible pour le moment.`);

    const finalText = String(texte || '').trim() || `Réponse indisponible pour le moment.`;

    await saveMemoire({
      sujet,
      texte: finalText,
      source: 'wounanet',
      createdAt: new Date().toISOString(),
      version: VERSION
    });

    res.status(200).send(finalText);
  } catch (error) {
    console.error('Traitement échoué:', error.message);
    res.status(500).send(`Erreur interne: ${error.message}`);
  }
}

app.post('/api/chat', traiterRequete);
app.post('/api/analyse', traiterRequete);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.use((req, res) => {
  res.status(404).send('Route introuvable');
});

ensureStorage();
startAutoUpdateLoop();

app.listen(PORT, HOST, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 PEGINTICHAT V${VERSION}`);
  console.log('🌐 HOST :', HOST);
  console.log('🌐 PORT :', PORT);
  console.log('🧠 CHAT : ACTIF');
  console.log('🌍 WOUNANET : ACTIF');
  console.log('💾 MEMOIRE : ACTIVE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━');
});
