'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json({ limit: '2mb' }));

const SECRETKEY = 'peginti_fondateur_2026_Bertrand';

// MIRAP Phase 1
const MIRAP = {
  enigme: () => ({ reply: "💪 L'HOMME est CHEF DE FAMILLE 🏠", score: 100, phase: 1 }),
  exploration: () => ({ reply: "🧭 EXPLORATION MIRAP active", avance: true }),
  confrontation: () => ({ reply: "⚔️ CONFRONTATION MIRAP", challenge: true })
};

// 🔐 MIDDLEWARE JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: '🔐 Token JWT requis (Bearer)', 
      routes: ['/mcp (public)', '/secure/* (JWT)']
    });
  }
  
  jwt.verify(token, SECRETKEY, (err, user) => {
    if (err) return res.status(403).json({ error: '❌ Token invalide/expiré' });
    req.user = user;
    next();
  });
};

// 🏠 DASHBOARD PUBLIC
app.get('/', (req, res) => res.json({ 
  status: 'PEGINTICHAT v2.1 SÉCURISÉ ✅',
  ports: { public: 4000, secure: 5000 },
  routes: {
    public: '/mcp',
    secure: ['/secure/mirap', '/secure/admin', '/secure/boivini']
  }
}));

// 📡 MCP PUBLIC (MIRAP Phase 1)
app.post('/mcp', (req, res) => {
  const { method, params = {}, id = 1 } = req.body;
  if (method === 'diligentile' && MIRAP[params.etape]) {
    return res.json({ jsonrpc: '2.0', id, result: MIRAP[params.etape](params) });
  }
  res.json({ jsonrpc: '2.0', id, result: { status: 'PEGINTICHAT v2.1 prêt' } });
});

// 🔐 ZONES SÉCURISÉES
app.post('/secure/mirap', authenticateJWT, (req, res) => {
  res.json({ 
    jsonrpc: '2.0',
    authenticated: req.user.founder,
    result: MIRAP[req.body.params?.etape || 'enigme']()
  });
});

app.post('/secure/admin', authenticateJWT, (req, res) => {
  res.json({ 
    status: '🔐 ADMIN SECURE OK',
    founder: req.user.founder,
    role: req.user.role,
    authorized: true
  });
});

app.get('/health', (req, res) => res.json({ status: 'healthy' }));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ PEGINTICHAT v2.1 → http://127.0.0.1:${PORT}`);
  console.log('🔐 Routes sécurisées: /secure/*');
});
// test

const io = require('@pm2/io');

module.exports = () => {
  // Sessions actives
  io.metric({
    name: 'PEGINTI Sessions',
    value: () => getPegintiSessionsCount()
  });

  // Erreurs doctrinales
  io.metric({
    name: 'PEGINTI Errors',
    value: () => getPegintiErrorCount()
  });

  // Uptime institutionnel
  io.metric({
    name: 'PEGINTI Uptime',
    value: () => process.uptime()
  });
};

const io = require('@pm2/io');

function pegintiMetrics() {
  io.metric({
    name: 'Flux doctrinal PEGINTI',
    value: () => getPegintiSessionsCount() // à définir
  });

  io.metric({
    name: 'Artefacts actifs',
    value: () => getPegintiArtifactsCount() // à définir
  });

  io.metric({
    name: 'Sessions solennelles',
    value: () => getPegintiErrorsCount() // à définir
  });

  io.metric({
    name: 'Uptime institutionnel',
    value: () => process.uptime()
  });
}

module.exports = pegintiMetrics;

const io = require('@pm2/io');

function pegintiMetrics() {
  io.metric({
    name: 'Flux doctrinal PEGINTI',
    value: () => getPegintiSessionsCount() // à définir
  });

  io.metric({
    name: 'Artefacts actifs',
    value: () => getPegintiArtifactsCount() // à définir
  });

  io.metric({
    name: 'Sessions solennelles',
    value: () => getPegintiErrorsCount() // à définir
  });

  io.metric({
    name: 'Uptime institutionnel',
    value: () => process.uptime()
  });
}

module.exports = pegintiMetrics;

const io = require('@pm2/io');

// Simulations pour tests
function getPegintiSessionsCount() {
  return Math.floor(Math.random() * 50);
}

function getPegintiArtifactsCount() {
  return Math.floor(Math.random() * 10);
}

function getPegintiErrorsCount() {
  return Math.floor(Math.random() * 5);
}

function pegintiMetrics() {
  io.metric({
    name: 'Flux doctrinal PEGINTI',
    value: () => getPegintiSessionsCount()
  });

  io.metric({
    name: 'Artefacts actifs',
    value: () => getPegintiArtifactsCount()
  });

  io.metric({
    name: 'Sessions solennelles',
    value: () => getPegintiErrorsCount()
  });

  io.metric({
    name: 'Uptime institutionnel',
    value: () => process.uptime()
  });
}

module.exports = pegintiMetrics;

function getPegintiSessionsCount() {
  return pegintiDB.sessions.length; // lecture réelle
}

function getPegintiArtifactsCount() {
  return pegintiRepo.artifacts.count(); // lecture réelle
}

function getPegintiErrorsCount() {
  return pegintiLogger.errors.total; // lecture réelle
}

function getPegintiSessionsCount() {
  return Math.floor(Math.random() * 50);
}
function getPegintiArtifactsCount() {
  return Math.floor(Math.random() * 10);
}
function getPegintiErrorsCount() {
  return Math.floor(Math.random() * 5);
}

function getPegintiSessionsCount() {
  return pegintiDB.sessions.length; // exemple : lecture en base
}
function getPegintiArtifactsCount() {
}
function getPegintiErrorsCount() {
  return pegintiLogger.errors.total; // exemple : lecture en logs
}

cat > ~/NoyauUltra/src/metrics/boivini-metrics.js << 'EOF'
'use strict';

const io = require('@pm2/io');

// ======================================
// COMPTAGE INSTITUTIONNEL
// ======================================
let creations = 0;      // Codes générés
let corrections = 0;    // Erreurs fixées
let comparisons = 0;    // Tests validés
let authentifications = 0; // JWT validés

// Metrics Bo'oivini
const creationsMetric = io.metric({
  name: 'boivini_creations',
  id: io.metric_types.gauge,
  value: () => creations
});

const correctionsMetric = io.metric({
  name: 'boivini_corrections',
  id: io.metric_types.gauge,
  value: () => corrections
});

const comparisonsMetric = io.metric({
  name: 'boivini_comparaisons',
  id: io.metric_types.gauge,
  value: () => comparisons
});

const authMetric = io.metric({
  name: 'boivini_jwt_auth',
  id: io.metric_types.counter,
  value: () => authentifications
});

// ======================================
// FONCTIONS D'INCRÉMENTATION
// ======================================
const increment = {
  create: () => { creations++; return creations; },
  correct: () => { corrections++; return corrections; },
  compare: () => { comparisons++; return comparisons; },
  auth: () => { authentifications++; return authentifications; }
};

// ======================================
// EXPORTS
// ======================================
module.exports = {
  increment,
  metrics: {
    creationsMetric,
    correctionsMetric,
    comparisonsMetric,
    authMetric
  },
  stats: () => ({
    creations,
    corrections,
    comparisons,
    authentifications,
    total: creations + corrections + comparisons + authentifications
  })
};
EOF

