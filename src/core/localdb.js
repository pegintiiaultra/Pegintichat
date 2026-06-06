'use strict';
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/peginti.json');

class LocalDB {
  constructor() {
    this.data = {};
    this.load();
  }

  load() {
    if (fs.existsSync(dbPath)) {
      this.data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } else {
      this.data = {};
    }
  }

  save() {
    fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  get(key) {
    return this.data[key.toLowerCase()] || null;
  }

  set(key, value) {
    this.data[key.toLowerCase()] = value;
    this.save();
  }

  has(key) {
    return !!this.get(key);
  }
}

module.exports = LocalDB;
