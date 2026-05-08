# 🚀 Unified Railway Deployment - Frontend + Backend + Database

## Complete Setup in One Place

This guide shows how to deploy **Everything Together** on Railway from a single GitHub repository.

---

## 📊 Architecture (Unified)

```
┌─────────────────────────────────────────────────────────┐
│              RAILWAY PROJECT (One Place)               │
│                                                         │
│  ┌────────────────┐         ┌────────────────┐        │
│  │   FRONTEND     │         │   BACKEND      │        │
│  │  React/Vite   │─HTTPS──▶│  Express.js    │        │
│  │  Service 1     │         │  Service 2     │        │
│  └────────────────┘         └────────┬───────┘        │
│                                      │                 │
│                                      ▼                 │
│                            ┌─────────────────┐        │
│                            │    MONGODB      │        │
│                            │  Service 3      │        │
│                            │  (Atlas/Managed)│        │
│                            └─────────────────┘        │
│                                                         │
│  All Networked Together in One Railway Project        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Super Quick Setup (15 minutes)

### 1️⃣ MongoDB Setup (Free)
```bash
# Go to https://www.mongodb.com/cloud/atlas
# Sign up → Create cluster (free tier)
# Create user: taskmanager / strong-password
# Network: Add 0.0.0.0/0
# Get connection string: mongodb+srv://...
```

### 2️⃣ Update Your Code
```bash
# Update backend/.env
MONGODB_URI=mongodb+srv://taskmanager:password@cluster.mongodb.net/team-task-manager
PORT=5000
NODE_ENV=production
CORS_ORIGIN=your-frontend-domain

# Update team-task-manager/.env
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api
```

### 3️⃣ Push to GitHub
```bash
git add .
git commit -m "Setup for Railway deployment"
git push origin main
```

### 4️⃣ Deploy on Railway (All Together)
Go to https://railway.app:
```
1. New Project
2. "Deploy from GitHub"
3. Select Ethera_AI_Project repository
4. Railway auto-detects services (Frontend + Backend)
5. Click "Deploy"
```

That's it! Everything deployed together. ✅

---

## 📋 Detailed Step-by-Step

### Step 1: MongoDB Atlas (Free Tier)

**Time: 5 minutes**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" (or Login if you have account)
3. Create a new organization
4. Create a new project (name: `Ethera_AI_Project`)
5. Click "Create a Cluster":
   - Select **Free Tier** (512MB)
   - Choose region closest to you
   - Click "Create"
6. Wait 3-5 minutes for cluster to be ready
7. Set Database Access:
   - Click "Database Access"
   - Click "Add New Database User"
   - Username: `taskmanager`
   - Password: Use strong password (copy it!)
   - Click "Add User"
8. Set Network Access:
   - Click "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
9. Get Connection String:
   - Click "Clusters"
   - Click "Connect" on your cluster
   - Choose "Drivers"
   - Copy the connection string (Standard driver)
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `team-task-manager`

**Your MongoDB URI will look like:**
```
mongodb+srv://taskmanager:MySecurePassword123@cluster0.xyz.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

---

### Step 2: Update Your Code Files

#### A. Update `backend/.env`
Create or update this file:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://taskmanager:MySecurePassword123@cluster0.xyz.mongodb.net/team-task-manager?retryWrites=true&w=majority
USE_JSON_DB=false
CORS_ORIGIN=https://your-frontend-domain.up.railway.app
```

#### B. Update `team-task-manager/.env`
Create or update this file:
```env
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api
```

**⚠️ Note:** You'll get the exact domains from Railway after deployment!

#### C. Verify `backend/server.js` (Already Done)
The CORS and MongoDB are already configured correctly:
```javascript
const allowedOrigins = [
  process.env.CORS_ORIGIN || "http://localhost:5173",
  "http://localhost:3000"
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/team-task-manager')
```

---

### Step 3: GitHub Setup

**Push code to GitHub:**

```bash
# From project root directory
cd c:\Users\admin\OneDrive\Documents\Ethera_AI_Project

# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Setup for Railway deployment - Frontend, Backend, and MongoDB"

# Push to GitHub
git push origin main
```

**If you don't have a GitHub repo yet:**
1. Go to https://github.com/new
2. Create new repository: `Ethera_AI_Project`
3. Follow GitHub's instructions to push
4. Come back here after pushing

---

### Step 4: Railway Deployment (The Main Part!)

**Time: 10 minutes**

#### 4.1: Create Railway Project
1. Go to: https://railway.app
2. Click "Login" (with GitHub)
3. Authorize Railway access to GitHub
4. Click "New Project"
5. Select "Deploy from GitHub"
6. Look for your `Ethera_AI_Project` repository
7. Click on it to select
8. Railway will ask: "Configure Service" → Click "Deploy"

#### 4.2: Wait for Auto-Detection
Railway will automatically detect:
- **Backend service** (from `backend/package.json`)
- **Frontend service** (from `team-task-manager/package.json`)

You should see both services in the Railway dashboard!

#### 4.3: Configure Backend Service

In Railway Dashboard:
1. Click on "backend" service
2. Go to **"Domains"** tab
3. Click **"Generate Domain"**
4. Railway creates: `backend-xxxx.up.railway.app`
5. **Copy this domain!**
6. Go to **"Variables"** tab
7. Add these:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://taskmanager:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
   USE_JSON_DB=false
   CORS_ORIGIN=https://frontend-xxxx.up.railway.app
   ```
8. Wait for service to restart

#### 4.4: Configure Frontend Service

In Railway Dashboard:
1. Click on "team-task-manager" (or "frontend") service
2. Go to **"Settings"** tab
3. Scroll to "Build":
   - **Root Directory**: `team-task-manager`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
   - **Node Version**: `18` or `20`
4. Go to **"Domains"** tab
5. Click **"Generate Domain"**
6. Railway creates: `frontend-xxxx.up.railway.app`
7. **Copy this domain!**
8. Go to **"Variables"** tab
9. Add this:
   ```
   VITE_API_BASE_URL=https://backend-xxxx.up.railway.app/api
   ```
   (Use the backend domain from Step 4.3)
10. Wait for service to restart

#### 4.5: Configure MongoDB (If Using Railway MongoDB)

**Optional:** If you want Railway-managed MongoDB instead of Atlas:

1. In Railway project, click **"+ Add Service"**
2. Select **"MongoDB"**
3. Railway auto-provides MONGODB_URI
4. Copy it to backend variables
5. Done!

---

### Step 5: Verify Deployment

#### Check Backend is Running:
```bash
# In your browser, go to:
https://backend-xxxx.up.railway.app

# You should see:
{"message":"Team Task Manager backend is running."}
```

#### Check Frontend is Running:
```bash
# In your browser, go to:
https://frontend-xxxx.up.railway.app

# You should see your app's login page
```

#### Check API Connection:
1. Open your frontend
2. Try to login or create an account
3. Check browser console for errors
4. If working, MongoDB is connected! ✅

---

## 📊 What Each Service Does

| Service | What It Does | Domain |
|---------|-------------|--------|
| **Backend** | REST API, Auth, Database | `backend-xxxx.up.railway.app` |
| **Frontend** | User Interface, React App | `frontend-xxxx.up.railway.app` |
| **MongoDB** | Data Storage, Cloud Database | Atlas (external) |

All **connected automatically** through Railway!

---

## 🔄 Auto-Deployment from GitHub

Whenever you push code to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

**Railway automatically:**
1. Detects changes
2. Rebuilds services
3. Deploys new versions
4. All live in minutes! ⚡

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend
**Solution:**
1. Check `VITE_API_BASE_URL` variable
2. Verify backend domain is correct
3. Check CORS_ORIGIN in backend matches frontend domain
4. Check browser console for exact error

### Backend Can't Connect to MongoDB
**Solution:**
1. Check `MONGODB_URI` is correct
2. Check MongoDB Atlas allows all IPs (0.0.0.0/0)
3. Test URI locally: `npm run start:backend`
4. Check Railway backend logs for error

### Build is Failing
**Solution:**
1. Check build logs in Railway
2. Common issues:
   - Missing dependency
   - Node version mismatch
   - Wrong build command
3. Fix locally first: `npm run build:frontend`

### Variables Not Updating
**Solution:**
1. After adding variables, service must restart
2. Watch the "Deployments" tab
3. Wait for green checkmark
4. Refresh your app

---

## 📱 Final URLs (After Deployment)

```
Frontend:  https://frontend-xxxx.up.railway.app
Backend:   https://backend-xxxx.up.railway.app
API:       https://backend-xxxx.up.railway.app/api
```

Replace `xxxx` with Railway's generated string

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster deployed and running
- [ ] Database user created (taskmanager)
- [ ] MongoDB URI copied
- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] Environment variables set in Railway
- [ ] Domains generated for both services
- [ ] Frontend can reach backend
- [ ] Users can login/signup
- [ ] Data is saved in MongoDB

---

## 🎉 You're Done!

Your app is now live on Railway with:
- ✅ Frontend served worldwide
- ✅ Backend API running
- ✅ Database connected
- ✅ Auto-deployment on push
- ✅ All in one Railway project!

**Test it:** Open `https://frontend-xxxx.up.railway.app` in your browser

---

## 📞 Need Help?

- **Railway Docs**: https://docs.railway.app
- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **Vite Docs**: https://vitejs.dev

Good luck! 🚀
