const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://etheraaiproject-production.up.railway.app"
  ],
  credentials: true
}));
app.options("*", cors());

// Middleware
app.use(express.json());

// Check if using JSON database
const useJsonDB = process.env.USE_JSON_DB === 'true';

if (!useJsonDB) {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/team-task-manager')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
} else {
  console.log('Using JSON database instead of MongoDB');
}

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const projectRoutes = require('./routes/projects');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send({ message: 'Team Task Manager backend is running.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});