'use strict';
const express = require('express');
const Peginti = require('./src/peginti');
const app = express();

app.use(express.json({ limit: '1mb' }));

// Routes minimales ultra-rapides
app.get('/peginti/modules', (req, res) => res.json({ modules: Array.from(Peginti.modules.keys()) }));
app.post('/peginti/analyse', (req, res) => res.json(Peginti.analyse(req.body.question || '', req.body)));

app.listen(4000, '127.0.0.1', () => {
  console.log('🚀 PEGINTI ULTRA v2.0 → http://127.0.0.1:4000');
});
