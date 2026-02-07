function detectLanguage(text = "") {
  const content = text.toLowerCase();

  const frenchKeywords = [
    "bonjour", "salut", "merci", "je", "tu", "vous",
    "quoi", "comment", "pourquoi", "est", "suis"
  ];

  const englishKeywords = [
    "hello", "hi", "thanks", "thank", "i", "you",
    "what", "how", "why", "is", "are"
  ];

  let frScore = 0;
  let enScore = 0;

  frenchKeywords.forEach(word => {
    if (content.includes(word)) frScore++;
  });

  englishKeywords.forEach(word => {
    if (content.includes(word)) enScore++;
  });

  if (frScore > enScore) return "fr";
  if (enScore > frScore) return "en";

  return "unknown";
}

module.exports = { detectLanguage };
