'use strict';
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

app.use(express.json());

// 🔄 TOUT passe par vitrine → cerveau
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3001',  // BO'OIVINI invisible
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/matrice',      // /api/* → /matrice/*
    '^/bip': '/bip',          // /bip/* → /bip/*
    '^/modules': '/modules'   // /modules/* → /modules/*
  }
}));

// 🏠 Page d'accueil PEGINTICHAT
app.get('/', (req, res) => res.json({
  pegintichat: '✅ Vitrine publique PEGINTI',
  version: 'v2.0',
  cerveau: 'BO\'OIVINI actif (invisible)',
  endpoints: ['/api/*', '/bip/*', '/modules/*']
}));

app.listen(3000, () => console.log('🌍 PEGINTICHAT vitrine sur 3000 → BO\'OIVINI 3001'));
