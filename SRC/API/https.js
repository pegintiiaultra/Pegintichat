const express = require("express");
const { handleRequest } = require("../mcp/handlers");

function createHttpServer() {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      status: "PEGINTICHAT API running",
      version: "1.0.0"
    });
  });

  app.post("/mcp", (req, res) => {
    try {
      const response = handleRequest(req.body);
      res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}

module.exports = { createHttpServer };
