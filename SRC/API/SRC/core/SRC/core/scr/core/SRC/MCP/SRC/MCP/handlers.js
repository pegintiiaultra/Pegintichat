const { detectLanguage } = require("../core/language");

function handleRequest(request) {
  if (!request || !request.method) {
    return { error: "Invalid request" };
  }

  switch (request.method) {
    case "ping":
      return { reply: "pong" };

    case "identity":
      return {
        name: "PEGINTICHAT",
        version: "1.0.0",
        protocol: "MCP-compatible"
      };

    case "about": {
      const question = request.params?.question || "";
      const lang = detectLanguage(question);

      const responses = {
        fr: "Je suis PEGINTI, un mot en dialecte Eton du Cameroun. "
          + "PEGINTI signifie sagesse divine. Je suis un agent conversationnel "
          + "conçu pour faciliter la gestion clientèle, l’automatisation "
          + "et l’assistance numérique.",

        en: "I am PEGINTI, a word from the Eton dialect in Cameroon. "
          + "PEGINTI means divine wisdom. I am a conversational agent "
          + "designed to assist with customer management, automation, "
          + "and digital support.",

        unknown: "Language not recognized. Please use French or English."
      };

      return {
        language: lang,
        response: responses[lang] || responses.unknown
      };
    }

    default:
      return { error: "Unknown method" };
  }
}

module.exports = { handleRequest };
