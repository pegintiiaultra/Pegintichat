// PEGINTICHAT - MCP Server Entry Point

// Import des dépendances
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialisation du serveur
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Autoriser toutes les origines (à sécuriser en prod)
    methods: ["GET", "POST"]
  }
});

// Middleware pour servir une page d’accueil simple
app.get('/', (req, res) => {
  res.send('PEGINTICHAT MCP server is running 🚀');
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log('✅ Nouvel utilisateur connecté');

  // Réception d’un message
  socket.on('message', (msg) => {
    console.log('💬 Message reçu : ' + msg);
    // Diffusion à tous les utilisateurs connectés
    io.emit('message', msg);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('❌ Utilisateur déconnecté');
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Pegintichat est actif sur http://localhost:${PORT}`);
});

// Export du module
module.exports = { app, io };
