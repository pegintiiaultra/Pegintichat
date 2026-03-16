const { BoOiviniSDK } = require('./index.js');

const code = `
  require("./src/metrics/boivini-metrics");
  const x = "contre-nature";
`;

console.log(BoOiviniSDK.auditCode(code));

