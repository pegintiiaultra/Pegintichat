const express = require("express");
const path = require("path");
const app = express();

// Chemin vers le dossier public
const publicPath = path.join(__dirname);

// Servir les fichiers statiques
app.use(express.static(publicPath));

// Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("PEGINTI Public démarré sur le port " + PORT);
});
