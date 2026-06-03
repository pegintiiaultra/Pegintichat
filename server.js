const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.post('/api/chat', (req, res) => {
  const { sujet } = req.body;
  res.json({ sujet, reponse: "Réponse doctrinale BO’OIVINI", intention: "sensible" });
});

app.post('/api/wounanet', (req, res) => {
  const { sujet } = req.body;
  res.json({ sujet, reponse: "Résultats externes WOUNANET", intention: "generaliste" });
});

// Ping route
app.get('/ping', (req, res) => {
  res.json({ status: "ok", version: "2.2.0" });
});

// Lancement serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 PEGINTICHAT doctrinal server running on http://localhost:${PORT}`);
});
