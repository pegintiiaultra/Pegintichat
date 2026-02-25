'use strict';

console.log('🌍 PEGINTICHAT - Hémisphère GAUCHE (Public Afrique)');
console.log('👥 Chat communautaire gratuit - Vitrine Bo\'oivini simplifiée');

/* =====================================================
   HEMISPHERE GAUCHE : PEGINTICHAT PUBLIC
   - Chat gratuit Afrique
   - Capacités simplifiées
   - Doctrines générales
   - Clone vitrine Bo'oivini
===================================================== */

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'PEGINTICHAT - Chat public Peginti',
    hemisphere: 'GAUCHE',
    cible: 'Afrique communautaire gratuite',
    doctrines: ['transmission', 'stabilité', 'cohérence_naturelle']
  });
});

app.listen(3002, () => {
  console.log('🌍 Hémisphère GAUCHE: http://localhost:3000');
  console.log('✅ PEGINTI BINAURAL - 2 noyaux complémentaires');
});
