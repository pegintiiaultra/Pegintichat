'use strict';

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { analyserSujet } = require('../matrice/raisonner.js');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const API_SECRET_KEY = process.env.PEGINTI_API_KEY || 'peginti-key-defaut-changez-moi';

// Middlewares de sécurité & parsing
app.use(helmet());
app.use(cors({
  origin: ['https://pegintichat.online', 'http://localhost:3000'],
  methods: ['GET', 'POST']
}));
app.use(express.json({ limit: '1mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: { error: "Trop de requêtes, veuillez réessayer dans une minute." }
});
app.use('/api/', limiter);

// Middleware d'authentification par clé API
const authentifierRequete = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['x-api-key'];
  if (req.path === '/api/status') return next(); // Route publique
  if (!authHeader || (authHeader !== API_SECRET_KEY && authHeader !== `Bearer ${API_SECRET_KEY}`)) {
    return res.status(401).json({ error: "Accès non autorisé : Clé API invalide ou manquante" });
  }
  next();
};

app.use(authentifierRequete);

// Route statut
app.get('/api/status', (req, res) => {
  res.json({
    plateforme: "PEGINTI IA",
    statut: "EN LIGNE 🟢",
    domaine: "pegintichat.online",
    horodatage: new Date().toISOString()
  });
});

// Route analyse universelle
app.post('/api/analyser', async (req, res) => {
  try {
    const { sujet, mode } = req.body;
    if (!sujet || typeof sujet !== 'string') {
      return res.status(400).json({ error: "Le champ 'sujet' est obligatoire et doit être une chaîne valide." });
    }
    const resultat = await analyserSujet(sujet, mode);
    res.json({
      succes: true,
      donnees: resultat,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("[ERREUR ANALYSE]", err.message);
    res.status(500).json({ error: "Erreur lors du traitement de l'analyse IA" });
  }
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error("[ERREUR SERVEUR]", err);
  res.status(500).json({ error: "Erreur interne du serveur Express" });
});

// Démarrage du serveur sur 0.0.0.0 pour Termux & Cloudflare Tunnel
app.listen(PORT, HOST, () => {
  console.log(`⚡ [PEGINTI IA] Serveur actif sur http://${HOST}:${PORT}`);
  console.log(`🌐 Accessible via Cloudflare Tunnel sur https://pegintichat.online`);
});
