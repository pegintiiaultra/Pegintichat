const express = require("express");
const cors = require("cors");
const path = require("path");

const PermanentMemory = require("../core/memory");
const Filters = require("../core/filters");
const Nsissim = require("../core/nsissim");
const Wounanet = require("../core/wounanet");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const memory = new PermanentMemory();
const filters = new Filters();
const wounanet = new Wounanet();
const nsissim = new Nsissim(memory, filters, wounanet);

// API chat
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const response = await nsissim.process(message);
  res.json({ reply: response });
});

// status
app.get("/status", (req, res) => {
  res.json({ status: "PEGINTI IA ONLINE" });
});

module.exports = app;
