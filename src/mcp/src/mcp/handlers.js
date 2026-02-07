const detectLanguage = require("../core/language");
const identity = require("../core/identity");

function handleRequest(req) {
  const method = req.method;
  const params = req.params || {};

  if (method === "ping") {
    return { reply: "pong" };
  }

  if (method === "identity") {
    return {
      name: identity.name,
      version: identity.version,
      protocol: "MCP-compatible"
    };
  }

  if (method === "about") {
    const question = params.question || "";
    const lang = detectLanguage(question);

    if (lang === "fr") {
      return {
        language: "fr",
        response: "Je suis PEGINTI, un projet camerounais d’IA.",
      };
    }

    return {
      language: "en",
      response: "I am PEGINTI, a Cameroonian AI project.",
    };
  }

  return { error: "Unknown method" };
}

module.exports = { handleRequest };
