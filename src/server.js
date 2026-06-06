'use strict';

require('dotenv').config(); // ✅ Charge les variables depuis .env

const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================================================
   DOSSIERS
===================================================== */
const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MEM_FILE = path.join(__dirname, 'memoire.json');

/* =====================================================
   MIDDLEWARES
===================================================== */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* =====================================================
   MEMOIRE
===================================================== */
function loadMemoire() {
  try {
    if (!fs.existsSync(MEM_FILE)) return [];
    return JSON.parse(fs.readFileSync(MEM_FILE, 'utf8'));
  } catch (err) {
    console.error('MEMOIRE LOAD ERROR:', err);
    return [];
  }
}

function saveMemoire(entry) {
  try {
    const data = loadMemoire();
    const now = Date.now();
    const exists = data.find(m => m.sujet === entry.sujet && (now - new Date(m.time).getTime() < 10*60*1000));
    if (exists) return;
    data.push(entry);
    fs.writeFileSync(MEM_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('MEMOIRE SAVE ERROR:', err);
  }
}

/* =====================================================
   MOTEUR NARRATIF PEGINTI
===================================================== */
function formatNarrative(sujet, doctrinal = false) {
  let reponse = '';
  let developpement = '';
  let conclusion = '';
  const s = sujet.toLowerCase();

  if (doctrinal && s.includes('souveraineté numérique')) {
    reponse = "La souveraineté numérique est la capacité d’un peuple à maîtriser ses données et ses infrastructures digitales.";
    developpement = "Elle vise à réduire les dépendances technologiques extérieures et à renforcer l’autonomie stratégique.";
    conclusion = "Elle constitue un enjeu majeur pour l’Afrique dans la construction d’une économie numérique indépendante.";
  } else if (doctrinal && s.includes('défense identitaire')) {
    reponse = "La défense identitaire consiste à préserver les valeurs, la culture et les repères fondamentaux d’une communauté.";
    developpement = "Elle passe par la transmission des savoirs, la protection des langues et la valorisation des héritages historiques.";
    conclusion = "Elle permet de maintenir la continuité d’un peuple dans un environnement mondial en mutation.";
  } else {
    reponse = `La notion de ${sujet} peut être étudiée sous plusieurs angles complémentaires.`;
    developpement = `${sujet} possède des dimensions historiques, sociales, philosophiques et pratiques qui influencent son interprétation selon les contextes.`;
    conclusion = `Ainsi, ${sujet} doit être analysé à la fois dans son sens général et dans ses applications particulières.`;
  }

  return {
    sujet,
    narration: { reponse, developpement, conclusion },
    time: new Date().toISOString()
  };
}

/* =====================================================
   FRONTEND
===================================================== */
app.use(express.static(PUBLIC_DIR));
app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));

/* =====================================================
   STATUS
===================================================== */
app.get('/ping', (req, res) => {
  res.json({
    status: 'ONLINE',
    version: '2.2', // ✅ Version fixée
    service: 'PEGINTI CHAT',
    time: new Date().toISOString()
  });
});

/* =====================================================
   MEMOIRE
===================================================== */
app.get('/memoire', (req, res) => {
  res.json({ total: loadMemoire().length, data: loadMemoire() });
});

/* =====================================================
   CHAT PEGINTI (clé Bot)
===================================================== */
app.post('/api/chat', async (req, res) => {
  try {
    const sujet = (req.body.sujet || '').trim();
    if (!sujet) return res.status(400).json({ error: 'Sujet requis' });

    const botKey = process.env.PEGINTIBOTAPIKEY;
    if (!botKey) return res.status(500).json({ error: 'Clé API Bot manquante' });

    const result = formatNarrative(sujet, true);
    saveMemoire(result);

    res.json({ status: "CHAT LIVE", sujet, result });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Erreur interne Chat" });
  }
});

/* =====================================================
   WOUNANET (clé NewsData.io)
===================================================== */
app.post('/api/wounanet', async (req, res) => {
  try {
    const query = (req.body.query || '').trim();
    if (!query) return res.status(400).json({ error: 'Query manquante' });

    const apiKey = process.env.PEGINTINEWSAPIKEY;
    if (!apiKey) return res.status(500).json({ error: 'Clé API News manquante' });

    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=fr`;

    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`NewsData ${resp.status}`);
    const data = await resp.json();

    const result = data.results?.[0]?.title || "🌐 Aucun résultat trouvé";

    res.json({ status: "WOUNANET LIVE", query, result, source: "NewsData.io" });
  } catch (err) {
    console.error('WOUNANET ERROR:', err);
    res.status(500).json({ error: 'Erreur WOUNANET', details: err.message });
  }
});

/* =====================================================
   404
===================================================== */
app.use((req, res) => res.status(404).json({ error: 'Route introuvable' }));

/* =====================================================
   START
===================================================== */
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 PEGINTI CHAT v2.2');
  console.log(`🌍 Frontend : http://0.0.0.0:${PORT}`);
  console.log(`🧠 API Chat : http://0.0.0.0:${PORT}/api/chat`);
  console.log(`🌐 WOUNANET : http://0.0.0.0:${PORT}/api/wounanet`);
  console.log('✅ Frontend activé');
  console.log('✅ Mémoire activée');
  console.log('✅ Chat activé');
  console.log('✅ WOUNANET activé');
  console.log('');
});
