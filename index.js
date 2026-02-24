'use strict';
const express = require('express');
const BIP = require('./src/doctrinal');
const app = express();

app.use(express.json({limit:'1mb'}));

// PEGINTICHAT officiel
app.get('/', (req, res) => res.json({ 
  pegintichat: '✅ v2.0 BIP doctrinal actif', 
  port: 4000, 
  github: 'pegintiiaultra/Pegintichat' 
}));

app.post('/doctrinal/test', (req, res) => {
  res.json(BIP.test(req.body.test || 'foi'));
});

app.post('/bip/analyse', (req, res) => {
  res.json(BIP.analyser(req.body.sujet, req.body));
});

const server = app.listen(4000, '0.0.0.0', (err) => {
  if(err) console.error('PEGINTICHAT ERROR:', err);
  else console.log('🚀 PEGINTICHAT BIP → http://127.0.0.1:4000');
});
