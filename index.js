// PEGINTICHAT - MCP Server Entry Point

// =======================
// Imports
// =======================
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// =======================
// App & Server init
// =======================
const app = express();
const server = http.createServer(app);

// =======================
// Socket.IO init
// =======================
const io = new Server(server, {
  cors: {
    origin: '*', // ⚠️ À restreindre en production
    methods: ['GET', 'POST']
  }
});

// =======================
// Middlewares
// =======================
app.use(express.json());

// =======================
// Routes
// =======================
app.get('/', (req, res) => {
  res.status(200).send('PEGINTICHAT MCP server is running 🚀');
});

// =======================
// Socket.IO events
// =======================
io.on('connection', (socket) => {
  console.log(`✅ Utilisateur connecté : ${socket.id}`);

  socket.on('message', (msg) => {
    if (!msg) return;

    console.log('💬 Message reçu :', msg);

    // Broadcast à tous les clients (y compris l’émetteur)
    io.emit('message', {
  id: socket.id,
  message: msg,
  timestamp: new Date().toISOString()
});

// Réponse IA simulée
setTimeout(() => {
  io.emit('message', {
    id: "PEGINTI-IA",
    message: `J'ai bien compris : "${msg}"`,
    timestamp: new Date().toISOString()
  });
}, 600);

    });
  });

  socket.on('disconnect', (reason) => {
    console.log(`❌ Utilisateur déconnecté : ${socket.id} (${reason})`);
  });
});

// =======================
// Server start
// =======================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Pegintichat est actif sur http://localhost:${PORT}`);
});

// =======================
// Exports (tests / MCP usage)
// =======================
module.exports = { app, server, io };
