'use strict';

const BoOivini = require('./src/matrice/booivini.js');
const express = require('express');
const app = express();

app.get('/booivini/logique', (req, res) => {
  res.json(BoOivini.logique.preferencesNoyau);
});

app.get('/booivini/raisonner/:sujet', (req, res) => {
  const result = BoOivini.raisonnement.raisonner(req.params.sujet, 'africain');
  res.json(result);
});

app.listen(3001, () => {
  console.log('🔌 Hémisphère DROIT: http://localhost:3001');
});
