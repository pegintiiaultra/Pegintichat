const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: '🚀 PEGINTICHAT API active',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

router.post('/chat', (req, res) => {
  const { message, lang = 'fr' } = req.body;
  const replies = {
    fr: `PEGINTI: J'ai reçu "${message}" 💬`,
    en: `PEGINTI: Received "${message}" 💬`
  };
  res.json({
    reply: replies[lang] || replies.fr,
    peginti: true,
    lang
  });
});

module.exports = router;

