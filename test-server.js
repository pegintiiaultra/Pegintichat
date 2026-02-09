const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`📥 ${req.method} ${req.url} from ${req.socket.remoteAddress}`);

  res.writeHead(200, { 'Content-Type': 'application/json' });

  if (req.url === '/api/status') {
    res.end(JSON.stringify({ status: 'OK', message: 'PEGINTICHAT test server running' }));
  } else {
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Test server running on http://localhost:${PORT}`);
});
