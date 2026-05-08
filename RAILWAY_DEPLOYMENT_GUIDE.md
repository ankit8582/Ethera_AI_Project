# Railway Deployment Guide

## Overview
This guide will help you deploy:
1. **Frontend** (React/Vite) → Railway
2. **Backend** (Express.js) → Railway  
3. **MongoDB** → MongoDB Atlas (Free Tier)

---

## Step 1: Prepare MongoDB

### Option A: MongoDB Atlas (Recommended - Free)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project
4. Create a cluster (select free tier)
5. Set up database access:
   - Create a user with username and strong password
6. Get your connection string:
   - Click "Connect"
   - Select "Drivers"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority`

### Option B: Railway MongoDB
1. Go to [Railway.app](https://railway.app)
2. Create account and login
3. Create new project → Add Service → MongoDB
4. Railway will provide MONGODB_URI automatically

---

## Step 2: Deploy Backend to Railway

1. **Create GitHub Repository** (if not already done):
   ```bash
   cd c:\Users\admin\OneDrive\Documents\Ethera_AI_Project
   git init
   git add .
   git commit -m "Initial commit"
   ```
   Push to GitHub

2. **Railway Setup**:
   - Go to [Railway.app](https://railway.app)
   - Login/Sign up
   - Create new project
   - Select "Deploy from GitHub"
   - Connect your GitHub repo
   - Select the repository

3. **Configure Backend Service**:
   - In Railway dashboard, click on the service
   - Go to "Settings" → "Domains"
   - Add a domain (e.g., `team-task-manager-backend.up.railway.app`)
   
4. **Set Environment Variables**:
   - In Railway dashboard → Variables
   - Add these variables:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
     USE_JSON_DB=false
     CORS_ORIGIN=https://your-frontend-domain.up.railway.app
     ```

5. **Deploy**:
   - Railway will auto-deploy from GitHub
   - Check logs for any errors

---

## Step 3: Deploy Frontend to Railway

1. **Create a separate Railway service for frontend**:
   - In same Railway project, click "Add Service"
   - Select "Deploy from GitHub"
   - Same repository

2. **Configure Frontend Service**:
   - Select the repository
   - In Railway → Settings:
     - **Root Directory**: `team-task-manager`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`
   
3. **Add Domain**:
   - Go to "Domains" tab
   - Add a domain (e.g., `team-task-manager.up.railway.app`)

4. **Set Environment Variables**:
   - Add variable:
     ```
     VITE_API_BASE_URL=https://team-task-manager-backend.up.railway.app/api
     ```

---

## Step 4: Update Code for Production

Update your files to use environment variables properly:

### Backend (backend/server.js) - Already Good! ✓
The MONGODB_URI and PORT are already using environment variables.

### Frontend (team-task-manager/src/api.js) - Check Configuration
Ensure it's using the environment variable:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend.up.railway.app/api';
```

### Update CORS in Backend
Update the allowed origins in `backend/server.js`:
```javascript
const allowedOrigins = [
  "https://team-task-manager.up.railway.app",
  "https://team-task-manager-backend.up.railway.app",
  "http://localhost:5173"
];
```

---

## Step 5: GitHub Push for Auto-Deployment

```bash
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

Railway will automatically deploy on push!

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check MONGODB_URI in Railway variables
- Verify MongoDB Atlas allows Railway IP (allow all in Atlas)

### Frontend can't reach Backend
- Check CORS_ORIGIN in backend variables
- Verify frontend domain in CORS_ORIGIN
- Check VITE_API_BASE_URL is correct

### Build failing
- Check build logs in Railway dashboard
- Ensure Node.js version is compatible (12+)

---

## Final URLs
- **Frontend**: https://team-task-manager.up.railway.app
- **Backend**: https://team-task-manager-backend.up.railway.app
- **API**: https://team-task-manager-backend.up.railway.app/api

---

## Commands Reference

```bash
# Test locally before deploying
npm run start:backend
npm run start:frontend

# Build frontend
npm run build:frontend

# Check logs
# Use Railway dashboard → Service → Logs
```
