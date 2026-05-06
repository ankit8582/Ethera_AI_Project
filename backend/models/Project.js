const mongoose = require('mongoose');
const JSONDatabase = require('../db');

const useJsonDB = process.env.USE_JSON_DB === 'true';

let Project;

if (useJsonDB) {
  const projectDB = new JSONDatabase('projects');
  
  Project = {
    findOne: async (query) => projectDB.findOne(query),
    findById: async (id) => projectDB.findOneById(id),
    find: async (query) => projectDB.find(query),
    create: async (data) => {
      data.createdAt = new Date();
      return projectDB.create(data);
    },
    updateOne: async (query, updates) => {
      const project = projectDB.findOne(query);
      if (project) {
        return projectDB.updateOne(project._id, updates);
      }
      return null;
    },
    deleteOne: async (query) => {
      const project = projectDB.findOne(query);
      if (project) {
        return projectDB.deleteOne(project._id);
      }
      return null;
    },
  };
} else {
  const projectSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  Project = mongoose.model('Project', projectSchema);
}

module.exports = Project;
