function detectLanguage(text = "") {
  const lower = text.toLowerCase();

  // Français
  const frWords = ["bonjour", "salut", "merci", "oui", "non", "comment", "ça"];
  if (frWords.some(w => lower.includes(w))) return "fr";

  // Anglais
  const enWords = ["hello", "hi", "thanks", "please", "yes", "no", "how"];
  if (enWords.some(w => lower.includes(w))) return "en";

  // Espagnol
  const esWords = ["hola", "gracias", "si", "buenos", "dias"];
  if (esWords.some(w => lower.includes(w))) return "es";

  return "unknown";
}

module.exports = { detectLanguage };
