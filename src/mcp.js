const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    service: 'MCP - Mission Control Panel',
    status: 'actif 🇨🇲',
    features: ['monitoring', 'control', 'stats']
  });
});

module.exports = router;

