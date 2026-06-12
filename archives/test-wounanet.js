const Memory = require("./src/core/memory");
const mem = new Memory();

(async () => {
  console.log(await mem.process("bonjour"));   // devrait renvoyer la réponse interne
  console.log(await mem.process("peginti"));   // idem
  console.log(await mem.process("nsissim"));   // idem
})();
