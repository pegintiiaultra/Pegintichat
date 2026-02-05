// Import des dépendances
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialisation du serveur
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Gestion des connexions
io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté');

  // Exemple : réception d’un message
  socket.on('message', (msg) => {
    console.log('Message reçu : ' + msg);
    // Diffusion à tous les utilisateurs connectés
    io.emit('message', msg);
  });

  // Déconnexion
  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté');
  });
});

// Lancement du serveur
server.listen(3000, () => {
  console.log('Pegintichat est actif sur http://localhost:3000');
});

// Export du module
module.exports = { app, io };
