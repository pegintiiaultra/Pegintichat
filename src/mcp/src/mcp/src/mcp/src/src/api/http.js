const express = require("express");
const { processMcpRequest } = require("../mcp/server");

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
    const reply = processMcpRequest(req.body);
    res.json(reply);
  });

  return app;
}

module.exports = { createHttpServer };
