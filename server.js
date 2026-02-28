<<<<<<< HEAD
/**
 * SERVEUR PEGINTI - LA PORTE
 * Point d'entrée HTTP officiel : https://pegintichat.online
 * Propulsé par DSK PEGINTI IA (TOMTECH.INC)
 */

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour analyser le JSON
app.use(express.json());

// Route de santé /health
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'PEGINTICHAT-SERVER',
    timestamp: new Date().toISOString()
  });
});

// Route API Oracle /api/oracle
app.post('/api/oracle', (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message requis' });
  }
  
  res.status(200).json({
    success: true,
    reponse: 'Guidance reçue avec succès par DSK PEGINTI IA.',
    prompt: message.trim()
  });
});

// Lancement du serveur sur 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PEGINTI-Framework lancé sur http://0.0.0.0:${PORT}`);
=======
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

function pegintiProcessor(message) {
  return {
    module: "PEGINTICHAT",
    type: "BIP",
    coherence: "90%",
    validation: "✅ PEGINTICHAT prioritaire",
    reply: `Réponse doctrinale → ${message}`
  };
}

app.post('/chat', (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.json({ status: "error", reply: "⚠️ Aucun message reçu" });
  res.json(pegintiProcessor(message));
});

app.get('/premium', (req, res) => {
  res.json({
    banner: "📌 Vitrine premium TomTech.inc",
    option: "❌ Fermer",
    link: "https://peginti.premium"
  });
});

app.listen(port, () => {
  console.log(`✅ PEGINTI v2.2 prêt sur http://localhost:${port}`);
>>>>>>> 4922328 (PEGINTI v2.2 : ajout vitrine premium ULTRA, config PM2 et scripts de déploiement)
});
