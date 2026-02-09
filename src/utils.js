const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    ping: 'pong',
    utils: ['ping', 'health', 'stats'],
    message: 'PEGINTI Utils fonctionnels'
  });
});

router.get('/ping', (req, res) => {
  res.json({ ping: 'pong', timestamp: Date.now() });
});

module.exports = router;

