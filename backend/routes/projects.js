const express = require('express');
const Project = require('../models/Project');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    let projects;
    
    if (useJsonDB) {
      const allProjects = await Project.find({});
      projects = req.user.role === 'admin'
        ? allProjects
        : allProjects.filter(p => p.ownerId === userId || (p.members && p.members.includes(userId)));
    } else {
      const query = req.user.role === 'admin'
        ? {}
        : { $or: [{ ownerId: userId }, { members: userId }] };
      projects = await Project.find(query).populate('ownerId', 'username email role').populate('members', 'username email role');
    }
    
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Unable to fetch projects.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, memberEmails = [] } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required.' });

    let members = [];
    for (const email of memberEmails) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) members.push(user._id);
    }

    let project;
    if (useJsonDB) {
      project = await Project.create({
        name,
        description,
        ownerId: req.user.userId,
        members,
      });
    } else {
      project = new Project({
        name,
        description,
        ownerId: req.user.userId,
        members,
      });
      await project.save();
      await project.populate('ownerId', 'username email role');
      await project.populate('members', 'username email role');
    }

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to create project.' });
  }
});

router.patch('/:id/members', async (req, res) => {
  try {
    const { action, memberEmail } = req.body;
    if (!['add', 'remove'].includes(action) || !memberEmail) {
      return res.status(400).json({ message: 'Member action and email are required.' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (project.ownerId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify members.' });
    }

    const member = await User.findOne({ email: memberEmail.toLowerCase() });
    if (!member) return res.status(404).json({ message: 'Member email not found.' });

    if (!project.members) project.members = [];

    if (action === 'add') {
      if (!project.members.includes(member._id) && project.ownerId !== member._id) {
        project.members.push(member._id);
      }
    } else {
      project.members = project.members.filter((id) => id !== member._id);
    }

    const updated = await Project.updateOne({ _id: project._id }, { members: project.members });
    res.json(updated || project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to update project members.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (project.ownerId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    if (name) project.name = name;
    if (description) project.description = description;
    await project.save();
    await project.populate('ownerId', 'username email role');
    await project.populate('members', 'username email role');
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Unable to update project.' });
  }
});

module.exports = router;
