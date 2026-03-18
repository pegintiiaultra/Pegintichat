const express = require('express');
const app = express();
const port = process.env.PORT || 4000; // port différent de peginti-chat

app.use(express.json());
app.use(express.static('ultra_public'));

function ultraProcessor(message) {
  return {
    module: "PEGINTI-ULTRA",
    type: "PREMIUM",
    coherence: "95%",
    validation: "✅ PEGINTI-ULTRA confidentiel",
    reply: `Réponse premium → ${message}`
  };
}

app.post('/ultra-chat', (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.json({ status: "error", reply: "⚠️ Aucun message reçu" });
  res.json(ultraProcessor(message));
});

app.get('/dashboard', (req, res) => {
  res.json({
    banner: "🌟 Vitrine premium PEGINTI-ULTRA",
    option: "❌ Fermer",
    link: "https://peginti.ultra"
  });
});

app.listen(port, () => {
  console.log(`✅ PEGINTI-ULTRA prêt sur http://localhost:${port}`);
});
