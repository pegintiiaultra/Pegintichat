'use strict';

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

app.listen(3000, () => {
  console.log('🌍 Hémisphère GAUCHE: http://localhost:3000');
});
