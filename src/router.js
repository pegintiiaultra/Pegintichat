'use strict';
const express = require('express');
const Peginti = require('./peginti');
const router = express.Router();

router.get('/modules', (req, res) => {
  res.json({
    loaded: Array.from(Peginti.modules.keys()),
    status: 'PEGINTI modulaire v1.0',
    architecture: 'active'
  });
});

router.post('/analyse', (req, res) => {
  const { question, user_view, context = {} } = req.body;
  const result = Peginti.analyse(question, { user_view, context });
  res.json(result);
});

module.exports = router;
