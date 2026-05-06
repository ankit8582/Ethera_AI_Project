const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'team-task-secret';
const useJsonDB = process.env.USE_JSON_DB === 'true';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.use(authMiddleware);

// Get all tasks for a user or project
router.get('/', async (req, res) => {
  try {
    const { userId, projectId } = req.query;
    let allTasks = await Task.find({});
    
    let tasks = allTasks;
    if (projectId) {
      tasks = tasks.filter(t => t.projectId === projectId);
    }
    if (userId) {
      tasks = tasks.filter(t => t.userId === userId || t.assignedTo === userId);
    }
    
    tasks.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      category: req.body.category,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      userId: req.body.userId,
      assignedTo: req.body.assignedTo || req.body.userId,
      projectId: req.body.projectId || null,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.category) updates.category = req.body.category;
    if (req.body.priority) updates.priority = req.body.priority;
    if (req.body.dueDate) updates.dueDate = req.body.dueDate;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;
    if (req.body.assignedTo) updates.assignedTo = req.body.assignedTo;
    if (req.body.projectId !== undefined) updates.projectId = req.body.projectId;

    const updated = await Task.updateOne({ _id: task._id }, updates);
    res.json(updated || { ...task, ...updates });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Task.deleteOne({ _id: task._id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;