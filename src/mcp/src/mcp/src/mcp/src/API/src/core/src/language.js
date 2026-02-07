module.exports = function detectLanguage(text) {
  if (!text) return "fr";

  const english = ["what", "who", "why", "how", "hello"];
  const lower = text.toLowerCase();

  return english.some(w => lower.includes(w)) ? "en" : "fr";
};
