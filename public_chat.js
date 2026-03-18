const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>PEGINTICHAT - Vitrine publique</title>
  <style>
    body { font-family: Arial; background:#111; color:#eee; }
    #messages { list-style:none; padding:0; }
    #messages li { padding:4px; margin-bottom:4px; background:#222; }
  </style>
</head>
<body>
  <h2>PEGINTICHAT (Communauté Afrique)</h2>
  <p>Espace gratuit de recherche communautaire</p>
  <p>Annonce: Pour vos solutions numériques, contactez TomTech officiel (lien premium)</p>
  <ul id="messages"></ul>
  <form id="form">
    <input id="input" autocomplete="off" /><button>Envoyer</button>
  </form>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    socket.on('chat message', msg => {
      const li = document.createElement('li');
      li.textContent = msg;
      messages.appendChild(li);
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
      }
    });
  </script>
</body>
</html>
    `);
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

const io = new Server(server, { cors: { origin: "*" } });
io.on('connection', socket => {
  console.log("client connecté (public):", socket.id);
  socket.on('chat message', msg => io.emit('chat message', msg));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log("PEGINTICHAT public actif sur", PORT);
});
