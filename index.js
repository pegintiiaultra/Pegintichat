const { createHttpServer } = require("./src/api/http");

const PORT = process.env.PORT || 4000;

const app = createHttpServer();

app.listen(PORT, () => {
  console.log(`PEGINTICHAT API running on port ${PORT}`);
});
