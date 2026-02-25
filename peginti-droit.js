'use strict';
console.log('🧠 PEGINTICHAT - Hémisphère DROIT (Privé Premium)');
const express = require('express'); 
const app = express();

app.get('/', (req, res) => {
  res.json({ hemisphere: 'DROIT', status: 'premium', cible: 'développeurs' });
});

app.get('/booivini/logique', (req, res) => {
  res.json({ hemisphere: 'DROIT', logique: 'active', cible: 'premium', peginti: true });
});

app.get('/booivini/raisonner/peginti', (req, res) => {
  res.json({ hemisphere: 'DROIT', raisonner: 'peginti-ultra', status: 'online', doctrines: ['logique_naturelle', 'stabilité', 'transmission'] });
});

app.listen(3001, () => {
  console.log('🧠 Hémisphère DROIT: http://localhost:3001');
  console.log('✅ PEGINTI BINAURAL - 2 hémisphères synchronisés');
});
