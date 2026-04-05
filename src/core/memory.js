const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/memory.json");

class PermanentMemory {
  constructor() {
    this.data = this.load();
  }

  load() {
    if (!fs.existsSync(DB_PATH)) {
      return {};
    }
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  }

  save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
  }

  autoLearn(key, value) {
    if (this.data[key]) {
      this.data[key] += ` | Mise à jour: ${value}`;
      console.log("Mémoire renforcée:", key);
    } else {
      this.data[key] = value;
      console.log("Nouvelle donnée:", key);
    }
    this.save();
  }

  retrieve(key) {
    return this.data[key] || null;
  }
}

module.exports = PermanentMemory;
