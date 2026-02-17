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
