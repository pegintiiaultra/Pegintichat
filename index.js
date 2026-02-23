'use strict';

/* -------------------------------------------------------
   📌 IMPORTS
------------------------------------------------------- */
const express = require('express');
const jwt = require('jsonwebtoken');
const pm2io = require('@pm2/io');   // ← modèle PM2 correct

/* -------------------------------------------------------
   📌 CONFIGURATION
------------------------------------------------------- */
const app = express();
app.use(express.json({ limit: '2mb' }));

const SECRETKEY = 'peginti_fondateur_2026_Bertrand';

/* -------------------------------------------------------
   📊 PM2 IO — METRICS & MONITORING
------------------------------------------------------- */
pm2io.init({
  transactions: true,
  http: true,
  metrics: {
    eventLoop: true,
    heap: true,
    cpu: true
  }
});

/* -------------------------------------------------------
   🔥 MIRAP — PHASE 1
------------------------------------------------------- */
const MIRAP = {
  enigme: () => ({
    reply: "💪 L'HOMME est CHEF DE FAMILLE 🏠",
    score: 100,
    phase: 1
  }),

  exploration: () => ({
    reply: "🧭 EXPLORATION MIRAP active",
    avance: true
  }),

  confrontation: () => ({
    reply: "⚔️ CONFRONTATION MIRAP",
    challenge: true
  })
};

/* -------------------------------------------------------
   🔐 MIDDLEWARE JWT
------------------------------------------------------- */
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: '🔐 Token JWT requis (Bearer)',
      routes: ['/mcp (public)', '/secure/* (JWT)']
    });
  }

  jwt.verify(token, SECRETKEY, (err, user) => {
    if (err) return res.status(403).json({ error: '❌ Token invalide/expiré' });
    req.user = user;
    next();
  });
};

/* -------------------------------------------------------
   🏠 ROUTE DASHBOARD PUBLIC
------------------------------------------------------- */
app.get('/', (req, res) => {
  res.json({
    status: 'PEGINTICHAT v2.1 SÉCURISÉ ✅',
    ports: { public: 4000, secure: 5000 },
    routes: {
      public: ['/mcp', '/'],
      secure: ['/secure/mirap/enigme', '/secure/mirap/exploration', '/secure/mirap/confrontation']
    }
  });
});

/* -------------------------------------------------------
   🎤 ROUTE PUBLIC — MCP
------------------------------------------------------- */
app.get('/mcp', (req, res) => {
  res.json({
    message: "👋 Bienvenue dans PEGINTICHAT‑V2",
    mirap: "Accès public limité — utilisez /secure/* pour MIRAP complet"
  });
});

/* -------------------------------------------------------
   🔐 ROUTES MIRAP SÉCURISÉES
------------------------------------------------------- */
app.get('/secure/mirap/enigme', authenticateJWT, (req, res) => {
  res.json(MIRAP.enigme());
});

app.get('/secure/mirap/exploration', authenticateJWT, (req, res) => {
  res.json(MIRAP.exploration());
});

app.get('/secure/mirap/confrontation', authenticateJWT, (req, res) => {
  res.json(MIRAP.confrontation());
});

/* -------------------------------------------------------
   🔑 ROUTE POUR GÉNÉRER UN TOKEN JWT
------------------------------------------------------- */
app.post('/auth', (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: "❌ Champ 'user' requis" });
  }

  const token = jwt.sign({ user }, SECRETKEY, { expiresIn: '2h' });

  res.json({
    message: "🔐 Token généré avec succès",
    token
  });
});

/* -------------------------------------------------------
   🚀 SERVEUR
------------------------------------------------------- */
const PUBLIC_PORT = 4000;

app.listen(PUBLIC_PORT, () => {
  console.log(`🚀 PEGINTICHAT‑V2 lancé sur le port ${PUBLIC_PORT}`);
});
