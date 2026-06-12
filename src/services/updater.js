'use strict';

const fs = require('fs');
const path = require('path');

const STATUS_FILE = path.join(
__dirname,
'../data/status.json'
);

function updateStatus() {
const payload = {
updatedAt: new Date().toISOString(),
status: 'ONLINE'
};

fs.writeFileSync(
STATUS_FILE,
JSON.stringify(payload, null, 2)
);

console.log('🔄 Auto-update exécuté');
}

function start() {
updateStatus();
setInterval(updateStatus, 300000);
}

module.exports = { start };
