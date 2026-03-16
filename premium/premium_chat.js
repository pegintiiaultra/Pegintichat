const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("Bo’oivinichat premium actif\n");
}).listen(3002, () => console.log("Bo’oivinichat sur port 3002"));
