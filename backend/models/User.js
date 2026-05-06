const mongoose = require('mongoose');
const JSONDatabase = require('../db');

const useJsonDB = process.env.USE_JSON_DB === 'true';

let User;

if (useJsonDB) {
  // JSON Database wrapper
  const userDB = new JSONDatabase('users');
  
  User = {
    findOne: async (query) => userDB.findOne(query),
    findById: async (id) => userDB.findOneById(id),
    find: async (query) => userDB.find(query),
    create: async (data) => {
      data.createdAt = new Date();
      return userDB.create(data);
    },
    updateOne: async (query, updates) => {
      const user = userDB.findOne(query);
      if (user) {
        return userDB.updateOne(user._id, updates);
      }
      return null;
    },
    deleteOne: async (query) => {
      const user = userDB.findOne(query);
      if (user) {
        return userDB.deleteOne(user._id);
      }
      return null;
    },
  };
  
  // Add save method for compatibility
  User.model = function(data) {
    this.data = data;
    this.save = async () => {
      return User.create(data);
    };
    return this;
  };
} else {
  // MongoDB
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  User = mongoose.model('User', userSchema);
}

module.exports = User;
