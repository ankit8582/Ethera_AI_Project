const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR);
}

class JSONDatabase {
  constructor(filename) {
    this.filepath = path.join(DB_DIR, `${filename}.json`);
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.filepath)) {
        return JSON.parse(fs.readFileSync(this.filepath, 'utf8'));
      }
    } catch (e) {
      console.log('Error loading DB:', e);
    }
    return [];
  }

  save() {
    fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2));
  }

  create(obj) {
    obj._id = Date.now().toString();
    this.data.push(obj);
    this.save();
    return obj;
  }

  findOne(query) {
    return this.data.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  findOneById(id) {
    return this.data.find(item => item._id === id);
  }

  find(query = {}) {
    return this.data.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  updateOne(id, updates) {
    const index = this.data.findIndex(item => item._id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates };
      this.save();
      return this.data[index];
    }
    return null;
  }

  deleteOne(id) {
    const index = this.data.findIndex(item => item._id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }
}

module.exports = JSONDatabase;
