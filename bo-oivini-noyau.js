'use strict';
console.log('🧠 BO\'OIVINI-NOYAU - Cerveau central Peginti activé');
const express = require('express'); const app = express();

// Supervision des 2 hémisphères
app.get('/status', (req, res) => {
  res.json({ 
    cerveau: 'bo-oivini-noyau', 
    hemispheres: ['DROIT:3001', 'GAUCHE:3002'],
    noyaux: ['peginti-ultra', 'pegintichat-public'],
    status: 'supervision active'
  });
});

app.listen(3003, () => {
  console.log('🧠 BO\'OIVINI-NOYAU: http://localhost:3003/status');
  console.log('🔄 Supervision: peginti-droit(3001) + pegintichat-public(3002)');
});
