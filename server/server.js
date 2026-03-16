const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("PEGINTI ULTRA actif\n");
}).listen(3000, () => console.log("PEGINTI ULTRA sur port 3000"));
