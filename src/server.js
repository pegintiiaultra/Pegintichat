require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const { analyserSujet } = require('./matrice/raisonner.js');

const app = express();

// ⚡ 1. TRUST PROXY POUR CLOUDFLARE - CORRIGE L'ERREUR
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const API_SECRET_KEY = process.env.PEGINTI_API_KEY;

// ⚡ 2. MIDDLEWARES
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: ['https://pegintichat.online', 'http://localhost:3000'] }));
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// ⚡ 3. RATE LIMITER
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// ⚡ 4. AUTH
const authentifierRequete = (req, res, next) => {
  if (req.path === '/api/status') return next();
  const authHeader = req.headers['authorization'] || req.headers['x-api-key'];
  if (!authHeader || (authHeader !== API_SECRET_KEY && authHeader !== `Bearer ${API_SECRET_KEY}`)) {
    return res.status(401).json({ error: "Accès non autorisé : Clé API invalide" });
  }
  next();
};

// ⚡ 5. ROUTES API
app.get('/api/status', (req, res) => {
  res.json({
    plateforme: "PEGINTI IA",
    statut: "EN LIGNE 🟢",
    domaine: "https://pegintichat.online",
    tunnel: "PEGINTI-TUNNEL",
    client_ip: req.ip,
    horodatage: new Date().toISOString()
  });
});

app.post('/api/analyser', authentifierRequete, async (req, res) => {
  try {
    const { sujet, mode } = req.body;
    if (!sujet) return res.status(400).json({ error: "Le champ 'sujet' est obligatoire." });
    const resultat = await analyserSujet(sujet, mode);
    res.json({ succes: true, donnees: resultat });
  } catch (err) {
    console.error("[ERREUR ANALYSE]", err.message);
    res.status(500).json({ error: "Erreur lors du traitement de l'analyse IA" });
  }
});

// ⚡ 6. FALLBACK FRONT
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const server = app.listen(PORT, HOST, () => {
  console.log(`⚡ [PEGINTI IA] Serveur actif sur http://${HOST}:${PORT}`);
  console.log(`🌐 Accessible via Cloudflare Tunnel sur https://pegintichat.online`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
