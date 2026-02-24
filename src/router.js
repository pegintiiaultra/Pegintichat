'use strict';
const express = require('express');
const Peginti = require('./peginti');
const router = express.Router();

router.get('/modules', (req, res) => res.json({loaded: Array.from(Peginti.modules.keys())}));
router.post('/analyse', (req, res) => {
  const result = Peginti.analyse(req.body.question, req.body);
  res.json(result);
});

module.exports = router;
