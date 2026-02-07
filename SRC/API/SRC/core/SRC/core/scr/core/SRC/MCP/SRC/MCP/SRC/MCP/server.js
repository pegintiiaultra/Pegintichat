const readline = require("readline");
const { parseMessage, createResponse, createError } = require("./protocol");
const { handleRequest } = require("./handlers");

function startMCPServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on("line", (line) => {
    const request = parseMessage(line);
    if (!request) return;

    const result = handleRequest(request);

    if (result.error) {
      process.stdout.write(
        createError(request.id || null, result.error) + "\n"
      );
    } else {
      process.stdout.write(
        createResponse(request.id || null, result) + "\n"
      );
    }
  });
}

module.exports = { startMCPServer };
