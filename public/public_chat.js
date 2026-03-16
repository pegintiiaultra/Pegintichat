const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("PEGINTI CHAT public actif\n");
}).listen(3001, () => console.log("PEGINTI CHAT sur port 3001"));
