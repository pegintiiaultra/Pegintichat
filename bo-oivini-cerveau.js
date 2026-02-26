'use strict';
console.log('🧠 BO\'OIVINI - CERVEAU CENTRAL (2 hémisphères + 2 noyaux intégrés)');

// Express pour 2 sorties distinctes
const express = require('express');
const app = express();

// HÉMISPHÈRE GAUCHE: Pegintichat (vitrine publique)
app.get('/', (req, res) => {
  res.json({
    message: 'PEGINTICHAT - Vitrine communautaire gratuite',
    hemisphere: 'GAUCHE',
    cible: 'Afrique communautaire',
    doctrines: ['transmission', 'stabilité']
  });
});

// HÉMISPHÈRE DROIT: Bo'oivinichat (premium développeurs)
app.get('/booivini/logique', (req, res) => {
  res.json({
    hemisphere: 'DROIT',
    cible: 'Développeurs TomTech.inc + Entreprises',
    boivinichat: 'super-intelligent',
    status: 'premium'
  });
});

app.get('/booivini/raisonner/peginti', (req, res) => {
  res.json({
    hemisphere: 'DROIT',
    raisonner: 'peginti-ultra',
    sdk: 'intégré',
    status: 'online'
  });
});

// PORT UNIQUE 3000 (Bo'oivini répond sur tout)
app.listen(3000, () => {
  console.log('🧠 BO\'OIVINI-CERVEAU: http://localhost:3000');
  console.log('🌍 PEGINTICHAT: http://localhost:3000/');
  console.log('💎 Bo\'oivinichat: http://localhost:3000/booivini/*');
});
