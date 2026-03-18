cat > src/api.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: '🚀 PEGINTICHAT API running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

router.post('/chat', (req, res) => {
  const { message, lang = 'fr' } = req.body;
  res.json({
    reply: `PEGINTI: J'ai reçu "${message}" 💬`,
    peginti: true,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
EOF
