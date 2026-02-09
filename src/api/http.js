const express = require("express");
const { detectLanguage } = require("../utils/langdetect");

function createHttpServer() {
  const app = express();
  app.use(express.json());

  // Route test
  app.get("/", (req, res) => {
    res.json({ status: "PEGINTICHAT API running" });
  });

  // Route de détection de langue
  app.post("/detect-language", (req, res) => {
    const { text } = req.body || {};
    const language = detectLanguage(text);
    res.json({ language, text });
  });

  // Route de traduction simple
  app.post("/translate", (req, res) => {
    const { text, target } = req.body || {};

    const translations = {
      bonjour: { en: "hello", es: "hola" },
      hello: { fr: "bonjour", es: "hola" },
      hola: { fr: "bonjour", en: "hello" }
    };

    const lower = (text || "").toLowerCase();
    const translated = translations[lower]?.[target] || "unknown";

    res.json({ text, target, translated });
  });

  return app;
}

module.exports = { createHttpServer };
