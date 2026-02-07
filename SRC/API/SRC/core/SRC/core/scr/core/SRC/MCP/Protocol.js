function parseMessage(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function createResponse(id, result) {
  return JSON.stringify({
    jsonrpc: "2.0",
    id,
    result
  });
}

function createError(id, message) {
  return JSON.stringify({
    jsonrpc: "2.0",
    id,
    error: { message }
  });
}

module.exports = {
  parseMessage,
  createResponse,
  createError
};
