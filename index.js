const http = require("http");
const { createHttpServer } = require("./src/api/http");

const PORT = process.env.PORT || 3000;

const app = createHttpServer();
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 PEGINTICHAT API active sur http://localhost:${PORT}`);
});
