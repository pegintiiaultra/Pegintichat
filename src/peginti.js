'use strict';

const modules = new Map();
modules.set("core", require("./modules/core"));
modules.set("strat", require("./modules/strat"));
modules.set("bip", require("./modules/bip"));

module.exports = (data) => {
  const question = (data.question || "").toLowerCase();

  // Détection CORE (identité PEGINTI)
  if (/peginti|mission|vision|origine|création|identité|vitrine|application|bo.oivini|pegintichat|peginti237|tomtech/.test(question)) {
    return {
      peginti: true,
      domain: "core",
      module_used: "core",
      modules_actifs: Array.from(modules.keys()),
      response: modules.get("core").analyse(data)
    };
  }

  // Détection STRAT
  if (/stratégie|plan|business|décision|croissance|projet|entreprise/.test(question)) {
    return {
      peginti: true,
      domain: "strat",
      module_used: "strat",
      modules_actifs: Array.from(modules.keys()),
      response: modules.get("strat").analyse(data)
    };
  }

  // Détection BIP
  if (/bible|verset|chrétien|doctrine|foi|église/.test(question)) {
    return {
      peginti: true,
      domain: "bip",
      module_used: "bip",
      modules_actifs: Array.from(modules.keys()),
      response: modules.get("bip").analyse(data)
    };
  }

  // Fallback STRAT
  return {
    peginti: true,
    domain: "strat",
    module_used: "strat",
    modules_actifs: Array.from(modules.keys()),
    response: modules.get("strat").analyse(data)
  };
};
