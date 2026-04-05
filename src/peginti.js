const app = require("./api/server");

const PORT = 4000;

// Lancement du serveur PEGINTI IA
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 PEGINTI IA lancé sur port", PORT);
});
