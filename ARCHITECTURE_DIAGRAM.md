# Architecture Diagram - Unified Railway Deployment

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        RAILWAY.APP                             │
│                     (Single Project)                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │  FRONTEND SERVICE (Service #1)                  │    │  │
│  │  │                                                 │    │  │
│  │  │  ├─ React + Vite Application                  │    │  │
│  │  │  ├─ Domain: frontend-xxxx.up.railway.app     │    │  │
│  │  │  ├─ Port: $PORT (auto-assigned)              │    │  │
│  │  │  └─ Env: VITE_API_BASE_URL                  │    │  │
│  │  │       (points to backend domain)              │    │  │
│  │  │                                                 │    │  │
│  │  │  Build: npm run build                         │    │  │
│  │  │  Start: npm run preview -- --host 0.0.0.0   │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                         │                                 │  │
│  │                         │ HTTPS Requests                 │  │
│  │                         ▼                                 │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │  BACKEND SERVICE (Service #2)                  │    │  │
│  │  │                                                 │    │  │
│  │  │  ├─ Express.js REST API                       │    │  │
│  │  │  ├─ Domain: backend-xxxx.up.railway.app      │    │  │
│  │  │  ├─ Port: 5000                                │    │  │
│  │  │  └─ Endpoints:                                │    │  │
│  │  │       /api/auth    (authentication)          │    │  │
│  │  │       /api/tasks   (task management)         │    │  │
│  │  │       /api/projects (project management)     │    │  │
│  │  │                                                 │    │  │
│  │  │  Environment:                                  │    │  │
│  │  │  ├─ MONGODB_URI (connection string)          │    │  │
│  │  │  ├─ CORS_ORIGIN (frontend domain)            │    │  │
│  │  │  ├─ NODE_ENV (production)                    │    │  │
│  │  │  └─ USE_JSON_DB (false)                      │    │  │
│  │  │                                                 │    │  │
│  │  │  Start: node server.js                       │    │  │
│  │  └──────────────────┬───────────────────────────┘    │  │
│  │                     │                                 │  │
│  │                     │ TCP Connection                 │  │
│  │                     │ mongodb+srv://...              │  │
│  │                     ▼                                 │  │
│  │  ┌─────────────────────────────────────────────────┐    │  │
│  │  │  DATABASE SERVICE (MongoDB - Service #3)       │    │  │
│  │  │  OR External MongoDB Atlas                     │    │  │
│  │  │                                                 │    │  │
│  │  │  ├─ MongoDB Cluster (Free Tier)              │    │  │
│  │  │  ├─ Database: team-task-manager              │    │  │
│  │  │  ├─ Collections:                              │    │  │
│  │  │  │   - users (auth & profiles)               │    │  │
│  │  │  │   - projects (team projects)              │    │  │
│  │  │  │   - tasks (individual tasks)              │    │  │
│  │  │  ├─ Authentication: taskmanager user         │    │  │
│  │  │  └─ Network: Allows 0.0.0.0/0 (Railway IPs) │    │  │
│  │  │                                                 │    │  │
│  │  │  Hosted on: MongoDB Atlas                    │    │  │
│  │  │  or Railway's Managed MongoDB                │    │  │
│  │  └─────────────────────────────────────────────────┘    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│                    All Networked in Railway                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                              ↑
                              │
                         Git Push to
                          GitHub
                              │
                              │
                         Auto-Deploy
                        Every Time!
```

---

## Data Flow Diagram

```
┌──────────────┐
│   Browser    │ User opens: https://frontend-xxxx.up.railway.app
└──────┬───────┘
       │
       │ GET / (HTML, CSS, JS)
       │
       ▼
┌──────────────────────────┐
│   Frontend Service       │
│   (React Application)    │
└──────┬───────────────────┘
       │
       │ import { authLogin } from 'api.js'
       │
       ├─ POST /api/auth/login
       │         (username, password)
       │
       ▼
┌──────────────────────────┐
│   Backend Service        │
│   (Express.js API)       │
└──────┬───────────────────┘
       │
       │ Check password with bcryptjs
       │ Create JWT token
       │
       ├─ Query: db.users.findOne({email})
       │
       ▼
┌──────────────────────────┐
│   MongoDB Database       │
│   (team-task-manager)    │
└──────┬───────────────────┘
       │
       │ { _id, email, name, ... }
       │
       ▼
┌──────────────────────────┐
│   Backend Service        │
│   (Express.js API)       │ Returns: { token, user }
└──────┬───────────────────┘
       │
       │ Response: 200 OK + JWT
       │
       ▼
┌──────────────────────────┐
│   Frontend Service       │
│   (React Application)    │ Store token in localStorage
└──────┬───────────────────┘
       │
       │ User logged in! ✅
       │ Show dashboard
       │
       ▼
┌──────────────┐
│   Browser    │ Displays task manager interface
└──────────────┘
```

---

## Deployment Flow

```
1. Developer Works Locally
   ├─ Changes frontend code
   ├─ Changes backend code
   ├─ Tests locally: npm run start:backend, npm run dev
   └─ Everything works! ✅

2. Push to GitHub
   └─ git push origin main

3. Railway Detects Change
   └─ Webhook from GitHub triggers

4. Railway Auto-Build
   ├─ Frontend:
   │   ├─ npm install
   │   ├─ npm run build (Vite)
   │   └─ npm run preview
   │
   └─ Backend:
       ├─ npm install
       ├─ Connect to MongoDB
       └─ Start server

5. Railway Auto-Deploy
   ├─ Frontend goes live on https://frontend-xxxx.up.railway.app
   └─ Backend goes live on https://backend-xxxx.up.railway.app

6. Users See Changes
   └─ New code is live! 🎉
```

---

## File Structure

```
Ethera_AI_Project/
│
├── backend/                    ← Backend Service
│   ├── server.js              (Listens on port 5000)
│   ├── package.json           (npm start)
│   ├── .env.example           (MONGODB_URI, PORT, etc.)
│   ├── .env                   (Production secrets)
│   │
│   ├── models/
│   │   ├── User.js           (MongoDB schema)
│   │   ├── Project.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── auth.js           (POST /api/auth/login)
│   │   ├── projects.js       (CRUD /api/projects)
│   │   └── tasks.js          (CRUD /api/tasks)
│   │
│   └── db.js                 (MongoDB connection)
│
├── team-task-manager/          ← Frontend Service
│   ├── vite.config.js         (Vite bundler config)
│   ├── package.json           (npm run build)
│   ├── .env.example           (VITE_API_BASE_URL)
│   ├── .env                   (Production env vars)
│   │
│   ├── src/
│   │   ├── main.jsx          (Entry point)
│   │   ├── App.jsx           (Main component)
│   │   ├── api.js            (Fetch API helper)
│   │   │
│   │   ├── components/       (React components)
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   │
│   │   └── pages/            (Route pages)
│   │       ├── LoginPage.jsx
│   │       └── ...
│   │
│   └── dist/                 (Built output)
│
├── .gitignore               (Git ignore rules)
│
├── START_HERE_UNIFIED.md    ⭐ Read this first!
├── QUICK_UNIFIED_DEPLOYMENT.md
├── UNIFIED_RAILWAY_DEPLOYMENT.md
└── package.json            (Root workspace)
```

---

## Environment Variables (Unified)

```
┌─────────────────────────────────────────────┐
│  RAILWAY DASHBOARD - Variables              │
├─────────────────────────────────────────────┤
│                                             │
│  Backend Service Variables:                │
│  ├─ PORT = 5000                            │
│  ├─ NODE_ENV = production                  │
│  ├─ MONGODB_URI = mongodb+srv://user:pw... │
│  ├─ CORS_ORIGIN = https://frontend-xxxx... │
│  └─ USE_JSON_DB = false                    │
│                                             │
│  Frontend Service Variables:                │
│  └─ VITE_API_BASE_URL = https://backend... │
│                                             │
└─────────────────────────────────────────────┘
        │
        │ Used by services
        │
        ▼
┌─────────────────────────────────────────────┐
│  Runtime Environment                       │
├─────────────────────────────────────────────┤
│                                             │
│  Backend Process:                          │
│  process.env.MONGODB_URI                  │
│  process.env.PORT                         │
│  process.env.CORS_ORIGIN                  │
│                                             │
│  Frontend Process:                         │
│  import.meta.env.VITE_API_BASE_URL        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Security Flow

```
User's Browser
    │
    ├─ Send credentials (HTTPS encrypted)
    │
    ▼
Frontend Service (Railway)
    │
    ├─ Validate input
    ├─ Send to backend API
    │
    ▼
Backend Service (Railway)
    │
    ├─ Hash password with bcryptjs
    ├─ Compare with MongoDB stored hash
    ├─ IF match:
    │   ├─ Create JWT token (signed secret)
    │   └─ Send back JWT
    │
    ▼
Frontend Service
    │
    ├─ Store JWT in localStorage
    ├─ Send JWT with every API request
    │
    ▼
Backend Service
    │
    ├─ Verify JWT signature
    ├─ IF valid: Allow access to protected routes
    ├─ IF invalid: Return 401 Unauthorized
    │
    ▼
MongoDB
    │
    └─ Requires authentication
        └─ MongoDB URI has username:password
```

---

## Scaling Potential

```
Single Railway Project
│
├─ Frontend Service (Vite static)
│   └─ Can serve thousands of users
│
├─ Backend Service (Node.js)
│   └─ Can scale horizontally on Railway
│
└─ Database (MongoDB)
    └─ Free tier: 512MB
    └─ Upgrade as needed

This is YOUR current setup! ✅
Perfect for production use.
```

---

## Summary

✅ **Everything is unified in one Railway project**
✅ **Automatic deployment on GitHub push**
✅ **All services networked together**
✅ **Secure authentication with JWT**
✅ **MongoDB cloud storage**
✅ **Production-ready setup**

Next step: Read `START_HERE_UNIFIED.md`! 🚀
