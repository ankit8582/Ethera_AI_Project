const mongoose = require('mongoose');
const JSONDatabase = require('../db');

const useJsonDB = process.env.USE_JSON_DB === 'true';

let Task;

if (useJsonDB) {
  const taskDB = new JSONDatabase('tasks');
  
  Task = {
    findOne: async (query) => taskDB.findOne(query),
    findById: async (id) => taskDB.findOneById(id),
    find: async (query) => taskDB.find(query),
    create: async (data) => {
      data.createdAt = new Date();
      return taskDB.create(data);
    },
    updateOne: async (query, updates) => {
      const task = taskDB.findOne(query);
      if (task) {
        return taskDB.updateOne(task._id, updates);
      }
      return null;
    },
    deleteOne: async (query) => {
      const task = taskDB.findOne(query);
      if (task) {
        return taskDB.deleteOne(task._id);
      }
      return null;
    },
  };
} else {
  const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Work',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'High',
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
    assignedTo: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  Task = mongoose.model('Task', taskSchema);
}

module.exports = Task;