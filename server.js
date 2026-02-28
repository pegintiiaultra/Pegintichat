const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

function pegintiProcessor(message) {
  return {
    module: "PEGINTICHAT",
    type: "BIP",
    coherence: "90%",
    validation: "✅ PEGINTICHAT prioritaire",
    reply: `Réponse doctrinale → ${message}`
  };
}

app.post('/chat', (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.json({ status: "error", reply: "⚠️ Aucun message reçu" });
  res.json(pegintiProcessor(message));
});

app.get('/premium', (req, res) => {
  res.json({
    banner: "📌 Vitrine premium TomTech.inc",
    option: "❌ Fermer",
    link: "https://peginti.premium"
  });
});

app.listen(port, () => {
  console.log(`✅ PEGINTI v2.2 prêt sur http://localhost:${port}`);
});
