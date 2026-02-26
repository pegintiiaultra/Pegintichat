'use strict';
const express = require('express');
const app = express();
const bip = require('./modules/bip');
const strat = require('./modules/strat');
const philo = require('./modules/philo');
const mirap = require('./modules/mirap');

// Public GAUCHE
app.get('/', (req, res) => {
  const chat = req.query.chat || 'Bienvenue sur PEGINTICHAT';
  res.json({
    message: 'PEGINTICHAT - Vitrine communautaire gratuite',
    hemisphere: 'GAUCHE',
    chat,
    reponse: `Bonjour ! PEGINTICHAT vous accueille dans la communauté Afrique.`,
    doctrines: ['transmission', 'stabilité']
  });
});

// Premium DROIT
app.get('/booivini/chat', (req, res) => {
  const message = req.query.message || 'test';
  const auth = req.get('Authorization');
  if (auth !== 'TomTech') return res.status(401).json({ error: 'Accès premium requis' });
  res.json({
    hemisphere: 'DROIT',
    assistant: 'Bo\'oivinichat',
    message_user: message,
    reponse: `Analyse IA: "${message}" → Solution premium TomTech.inc générée.`,
    status: 'premium'
  });
});

// Analyse doctrinale dynamique
app.get('/peginti/analyse', (req, res) => {
  const question = req.query.q || "Question vide";
  res.json({
    module: "BIP – Analyse doctrinale PEGINTI v2.0",
    question,
    cadres: [
      bip.reference(question),
      philo.tradition(question),
      mirap.conscience(question)
    ],
    doctrine: "VALIDÉE – Cohérence 100%"
  });
});

// Stratégie dynamique
app.get('/peginti/strategie', (req, res) => {
  const objectif = req.query.obj || "Objectif vide";
  res.json({
    module: "STRATÉGIE ULTRA RAPIDE",
    objectif,
    plan: strat.ultraRapide(objectif),
    action: "Modularité + BO'OIVINI",
    vision: "Conscience institutionnelle CM",
    status: "⚡ Exécuter maintenant"
  });
});

app.listen(3000, () => {
  console.log('🧠 BO\'OIVINI: http://localhost:3000/');
});

// Module de collaboration PEGINTICHAT ↔ Bo'oivinichat
const collab = require('./modules/collab');

app.get('/peginti/router', (req, res) => {
  const question = req.query.q || "Question vide";
  const route = collab.router(question);
  res.json({
    question,
    destination: route.cible,
    module: route.module,
    type: route.type,
    status: "Routage dynamique OK"
  });
});
