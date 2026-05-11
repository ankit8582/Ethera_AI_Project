
╔══════════════════════════════════════════════════════════════════╗
║              ETHERA AI - TEAM TASK MANAGER                      ║
║              Project Documentation & Deployment Info            ║
╚══════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🌐  LIVE APPLICATION URLs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Frontend (React App):
  → https://ethera-frontend-production.up.railway.app

  Backend API:
  → https://etheraaiproject-production.up.railway.app

  Railway Project Dashboard:
  → https://railway.com/project/bad46a33-340e-4081-a0e8-062356f22e96

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📁  GITHUB REPOSITORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Repository URL:
  → https://github.com/ankit8582/Ethera_AI_Project

  Clone Command:
  → git clone https://github.com/ankit8582/Ethera_AI_Project.git

  Main Branch: main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📋  PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Name        : Ethera AI - Team Task Manager
  Version     : 1.0.0
  Description : A premium, full-stack team task management
                application with real-time collaboration,
                Firebase authentication, and MongoDB backend.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🛠️  TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Frontend:
  ├── React 19
  ├── Vite (build tool)
  ├── TailwindCSS v4
  ├── Custom CSS (Glassmorphism Design System)
  ├── React Router DOM
  └── Firebase Authentication

  Backend:
  ├── Node.js
  ├── Express.js
  ├── MongoDB (MongoDB Atlas)
  └── Mongoose ODM

  Deployment:
  └── Railway.app (3 services: frontend + backend + DB connector)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✨  KEY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅  User Registration & Login (Firebase + Local fallback)
  ✅  Password Reset via Email (Firebase)
  ✅  Create, Edit, Delete Tasks
  ✅  Task Categories: Work, Personal, Shopping, Health, Learning
  ✅  Task Priority: High, Medium, Low
  ✅  Due Date tracking with Overdue detection
  ✅  Task Completion toggle
  ✅  Drag & Drop task reordering
  ✅  Search & Sort tasks
  ✅  Project & Team Management
  ✅  Add/Remove Team Members to Projects
  ✅  Assign Tasks to Members
  ✅  Progress Bar (completion percentage)
  ✅  Dashboard Statistics (Total, Completed, Pending, Overdue)
  ✅  Dark/Light Mode toggle
  ✅  Offline-first (LocalStorage fallback)
  ✅  Responsive Design (mobile + desktop)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎨  UI DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Theme         : Premium Dark (Glassmorphism)
  Font          : Plus Jakarta Sans, Inter (Google Fonts)
  Primary Color : Indigo (#6366f1)
  Accent Colors : Purple, Cyan, Emerald, Amber
  Effects:
  ├── Glassmorphism cards (backdrop-filter: blur)
  ├── Animated gradient backgrounds
  ├── Floating animations on icons
  ├── Shimmer text gradients
  ├── Smooth hover transitions
  ├── Priority badges (color-coded)
  ├── Toast notifications (slide-in)
  └── Box-shadow glow on dashboard boundary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📁  PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Ethera_AI_Project/
  ├── backend/
  │   ├── server.js              ← Express server, CORS, routes
  │   ├── routes/
  │   │   ├── tasks.js           ← Task CRUD API
  │   │   ├── projects.js        ← Project API
  │   │   └── auth.js            ← Auth API
  │   └── models/
  │       ├── Task.js            ← MongoDB Task schema
  │       ├── Project.js         ← MongoDB Project schema
  │       └── User.js            ← MongoDB User schema
  ├── team-task-manager/         ← React Frontend
  │   ├── src/
  │   │   ├── App.jsx            ← Main component (all pages)
  │   │   ├── index.css          ← Premium design system CSS
  │   │   └── firebaseConfig.js  ← Firebase configuration
  │   ├── public/
  │   ├── package.json
  │   └── vite.config.js
  ├── README.txt                 ← This file
  └── Procfile                   ← Railway deployment config

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚙️  LOCAL SETUP & DEVELOPMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Clone the repository:
     git clone https://github.com/ankit8582/Ethera_AI_Project.git
     cd Ethera_AI_Project

  2. Setup Backend:
     cd backend
     npm install
     Create .env file with:
       MONGODB_URI=your_mongodb_atlas_uri
       PORT=5000
       CORS_ORIGIN=http://localhost:5173
     npm start

  3. Setup Frontend:
     cd team-task-manager
     npm install
     Create .env file with:
       VITE_API_URL=http://localhost:5000
       VITE_FIREBASE_API_KEY=your_key
       VITE_FIREBASE_AUTH_DOMAIN=your_domain
       VITE_FIREBASE_PROJECT_ID=your_project_id
     npm run dev

  4. Open browser: http://localhost:5173

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀  DEPLOYMENT (RAILWAY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Platform      : Railway.app
  Auto-Deploy   : Yes (pushes to GitHub main branch auto-deploy)
  Services:
  ├── ethera-frontend   → React/Vite app
  ├── ethera-backend    → Node/Express API
  └── Ethera_AI_Project → Main project connector

  Environment Variables (set in Railway dashboard):
  Backend Service:
  ├── MONGODB_URI       = mongodb+srv://...
  ├── PORT              = (auto-assigned by Railway)
  └── CORS_ORIGIN       = https://ethera-frontend-production.up.railway.app

  Frontend Service:
  ├── VITE_API_URL      = https://etheraaiproject-production.up.railway.app
  └── (Firebase vars)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👤  DEVELOPER INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Developer  : Ankit
  GitHub     : https://github.com/ankit8582
  Project    : Ethera AI Team Task Manager
  Year       : 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📝  RECENT UPDATES (v1.0.0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅  Premium CSS design system implemented (Glassmorphism)
  ✅  All auth pages redesigned (Login, Register, Reset)
  ✅  Dashboard welcome banner with gradient effects
  ✅  Stat cards with entrance animations
  ✅  Task cards with priority badges
  ✅  Project & Team Management - dark inputs (removed white bg)
  ✅  Dashboard boundary box-shadow glow added
  ✅  Progress bar with animated gradient
  ✅  Premium header with glassmorphism effect
  ✅  Premium footer with gradient branding
  ✅  Google Fonts (Plus Jakarta Sans) integrated
  ✅  Deployed to Railway production environment

╔══════════════════════════════════════════════════════════════════╗
║  © 2026 Ethera AI. Built with React, Firebase & MongoDB.        ║
╚══════════════════════════════════════════════════════════════════╝
