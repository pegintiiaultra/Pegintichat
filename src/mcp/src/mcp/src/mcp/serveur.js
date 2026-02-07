const { handleRequest } = require("./handlers");
const protocol = require("./protocol");

function processMcpRequest(body) {
  try {
    const result = handleRequest(body);
    return protocol.success(result);
  } catch (err) {
    return protocol.failure(err.message);
  }
}

module.exports = { processMcpRequest };
