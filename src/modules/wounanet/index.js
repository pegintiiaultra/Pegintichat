'use strict';
const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => res.json({ module: 'wounanet', status: 'Prêt - Attente contenu Bertrand', version: '1.0' }));

module.exports = router;
