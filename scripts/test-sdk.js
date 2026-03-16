const { BoOiviniSDK } = require("./bo-oivini/modules/sdk.js");

const result = BoOiviniSDK.auditCode('require("./src/metrics/boivini-metrics")');
console.log(result);
