'use strict';

const CodeChecker = {
  analyze: (sourceCode) => {
    const issues = [];

    if (sourceCode.includes("require(\"./src/metrics/boivini-metrics\")")) {
      issues.push({
        type: "MODULE_NOT_FOUND",
        message: "Le module boivini-metrics est introuvable. Supprimez ou remplacez cette ligne."
      });
    }

    if (sourceCode.includes("contre-nature")) {
      issues.push({
        type: "DOCTRINE",
        message: "Pratique contre-nature détectée. Rejetée par Bo'oivini."
      });
    }

    return issues;
  },

  suggestFix: (issue) => {
    if (issue.type === "MODULE_NOT_FOUND") {
      return "// Correction: ligne supprimée car module inexistant";
    }
    if (issue.type === "DOCTRINE") {
      return "// Correction doctrinale: rejet des pratiques contre-nature";
    }
    return "// Aucune correction nécessaire";
  }
};
const { BoOiviniSDK } = require("./bo-oivini/modules/sdk.js");
const audit = BoOiviniSDK.auditCode(msg);
app.post("/chat", (req, res) => {
  const msg = req.body.msg || "";
  const audit = BoOiviniSDK.auditCode(msg);

  res.json({
    entree: msg,
    audit,
    sortie: audit.isClean ? "Message conforme" : "Message corrigé doctrinalement"
  });
});
const BoOiviniSDK = {
  auditCode: (code) => {
    const issues = CodeChecker.analyze(code);
    const fixes = issues.map(issue => CodeChecker.suggestFix(issue));
    return { issues, fixes, isClean: issues.length === 0 };
  },

  validateDoctrine: (text) => {
    const forbidden = ["contre-nature", "immoral", "péché"];
    return !forbidden.some(word => text.toLowerCase().includes(word));
  },

  fixNoyauUltra: (indexPath) => {
    const fs = require('fs');
    let code = fs.readFileSync(indexPath, 'utf8');
    const lines = code.split('\n');
    const cleaned = lines
      .map(line => {
        if (line.includes('boivini-metrics') || line.includes('metrics = require')) {
          return CodeChecker.suggestFix({type: "MODULE_NOT_FOUND"});
        }
        return line;
      })
      .filter(line => !line.includes('cat > ~/PEGINTICHAT'));
    fs.writeFileSync(indexPath, cleaned.join('\n'));
    return "✅ NoyauUltra corrigé par Bo'oivini";
  },

  smartStart: async () => {
    const { execSync } = require('child_process');
    try {
      execSync('pm2 stop all', {stdio: 'inherit'});
      execSync('lsof -i :3000 | awk \'NR>1 {print $2}\' | xargs kill -9 || true', {stdio: 'inherit'});
      execSync('pm2 start ~/PEGINTICHAT/index.js --name "pegintichat-bo\'oivini"', {stdio: 'inherit'});
      BoOiviniSDK.fixNoyauUltra('~/NoyauUltra/index.js');
      execSync('pm2 start ~/NoyauUltra/index.js --name "noyau-ultra-bo\'oivini"', {stdio: 'inherit'});
      execSync('pm2 save', {stdio: 'inherit'});
      console.log("🚀 Bo'oivini SDK : Tous les agents opérationnels");
    } catch (error) {
      console.error("❌ Bo'oivini détecte une anomalie:", error.message);
    }
  }
};

console.log("🤖 Bo'oivini SDK Peginti - Agent Ultra Avancé chargé");

module.exports = { CodeChecker, BoOiviniSDK };
