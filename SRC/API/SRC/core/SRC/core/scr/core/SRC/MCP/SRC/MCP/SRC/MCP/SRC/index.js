const { startMCPServer } = require("./mcp/server");
const { log } = require("./core/logger");

function start() {
  log("Starting MCP server...");
  startMCPServer();
}

module.exports = { start };
