const express = require('express');
const collab = require('./modules/collab');
const app = express();

app.get('/peginti/router', (req, res) => {
  const question = req.query.q || "test";
  res.json(collab.router(question));
});

app.get('/', (req, res) => {
  const chat = req.query.chat || 'bienvenue';
  const route = collab.router(chat);
  res.json({
    message: "PEGINTICHAT",
    chat: chat,
    reponse: route.destination === "PEGINTICHAT" ? 
      `👁️BIP: Réponse Peginti "${chat}"` : 
      "Question premium détectée",
    module: route.module
  });
});

app.get('/booivini/chat', (req, res) => {
  if (req.get('Authorization') !== 'TomTech') {
    return res.status(401).json({error: "Premium requis"});
  }
  const message = req.query.message || 'test';
  res.json({
    assistant: "Bo'oivinichat",
    reponse: `💎 PREMIUM: "${message}" → Solution entreprise TomTech.inc`,
    status: "95%"
  });
});

app.listen(3000, () => console.log('🧠 BO\'OIVINI v2.2 fixe'));
