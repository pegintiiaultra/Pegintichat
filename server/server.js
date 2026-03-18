const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir le dossier public
app.use(express.static(path.join(__dirname, '../public')));

// Route du chat PEGINTI
app.get('/peginti-chat', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/peginti-chat/index.html'));
});

// Route par défaut (compatible Express 5)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Port
const PORT = 3001;

app.listen(PORT, () => {
  console.log("PEGINTI ULTRA actif sur le port " + PORT);
});
