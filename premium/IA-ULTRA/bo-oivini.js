module.exports = {
  name: "BO’OIVINI",
  version: "1.0.0",
  type: "noyau-technique",
  reply: (input) => {
    return {
      boovini: true,
      message: `🧠 BO’OIVINI a traité : ${input}`,
      timestamp: new Date().toISOString()
    };
  }
};
