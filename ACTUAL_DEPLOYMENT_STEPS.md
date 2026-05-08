# 🚀 ACTUAL DEPLOYMENT - STEP BY STEP

## STEP 1: MongoDB Atlas Setup (Manual - 5 minutes)

### Action 1.1: Create MongoDB Account
```
1. Open: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email
4. Verify email (check inbox)
5. Create password
6. Click "Create Account"
```

### Action 1.2: Create Organization & Project
```
1. After login, create Organization (name: "Ethera AI")
2. Create Project (name: "team-task-manager")
3. Click "Create Project"
```

### Action 1.3: Create Cluster
```
1. In Project, click "Create" → "Database"
2. Select "M0 Free" tier
3. Select cloud provider: AWS (default)
4. Select region: (closest to you)
5. Click "Create Cluster"
6. Wait 2-5 minutes for cluster to deploy
7. You should see status: "Active" ✅
```

### Action 1.4: Create Database User
```
1. Click "Security" → "Database Access"
2. Click "Add New Database User"
3. Username: taskmanager
4. Password: Use this → Pa$$w0rd123TaskManager (COPY THIS!)
5. Method: Scram (default)
6. Click "Create Database User"
```

### Action 1.5: Allow Network Access
```
1. Click "Security" → "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Enter: 0.0.0.0/0
5. Click "Confirm"
```

### Action 1.6: Get Connection String
```
1. Click "Databases" → Your cluster
2. Click "Connect" button
3. Select "Drivers"
4. Choose "Node.js" driver
5. Copy the connection string (it will be highlighted)
6. It will look like:
   mongodb+srv://taskmanager:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority

7. REPLACE <password> with: Pa$$w0rd123TaskManager
   
8. Your final URI:
   mongodb+srv://taskmanager:Pa$$w0rd123TaskManager@cluster0.xxxx.mongodb.net/team-task-manager?retryWrites=true&w=majority

9. COPY THE FULL UPDATED STRING (we'll use it next)
```

**⏱️ TIME: 5 minutes**

✅ **What You'll Have:**
- MongoDB Atlas account
- Active cluster
- Database user: taskmanager
- Connection string

---

## STEP 2: Update Environment Files (Automated Below)

### What needs to change:

**backend/.env** (Update MONGODB_URI)
```
FROM: MONGODB_URI=mongodb://localhost:27017/team-task-manager
TO:   MONGODB_URI=mongodb+srv://taskmanager:Pa$$w0rd123TaskManager@cluster0.xxxxx.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

**team-task-manager/.env** (Add VITE_API_BASE_URL)
```
ADD: VITE_API_BASE_URL=http://localhost:5000/api
(for local testing)

OR for Railway:
VITE_API_BASE_URL=https://backend-xxxx.up.railway.app/api
(you'll get this after deploying to Railway)
```

**I will do this automatically next...**

---

## STEP 3: Test Backend Locally (Manual - 2 minutes)

After updating .env files:
```bash
# Terminal 1: Start backend
cd c:\Users\admin\OneDrive\Documents\Ethera_AI_Project\backend
npm install
npm start

# You should see:
# ✓ MongoDB connected
# ✓ Server running on port 5000
```

### Test if connected:
```bash
# Terminal 2: Test API
curl http://localhost:5000
# Should return: {"message":"Team Task Manager backend is running."}

curl http://localhost:5000/api/auth
# Should work (no CORS error)
```

---

## STEP 4: Update GitHub (Automated Below)

```bash
git add .
git commit -m "Setup MongoDB Atlas and environment variables"
git push origin main
```

---

## STEP 5: Railway Deployment (Manual - 10 minutes)

### Action 5.1: Login to Railway
```
1. Open: https://railway.app
2. Click "Login"
3. Select "GitHub"
4. Authorize Railway
5. You're logged in!
```

### Action 5.2: Create Project
```
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Select your repository: ethera_ai_project (or whatever it's named)
4. Railway will start deploying both services
```

### Action 5.3: Configure Backend Service
```
1. Wait for services to appear
2. Click on "backend" service
3. Go to "Settings":
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
4. Go to "Variables" tab
5. Add these variables:
   
   MONGODB_URI=mongodb+srv://taskmanager:Pa$$w0rd123TaskManager@cluster0.xxxxx.mongodb.net/team-task-manager?retryWrites=true&w=majority
   
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=supersecretteamkey
   USE_JSON_DB=false
   CORS_ORIGIN=https://your-frontend-domain.up.railway.app
   
   (Note: You'll get frontend domain from next step)

6. Click "Deploy"
7. Wait for build to complete
```

### Action 5.4: Get Backend Domain
```
1. In "backend" service, go to "Domains" tab
2. Click "Generate Domain"
3. You'll get: backend-xxxx.up.railway.app
4. COPY THIS (we need it for frontend)
```

### Action 5.5: Configure Frontend Service
```
1. Click on "team-task-manager" service
2. Go to "Settings":
   - Root Directory: team-task-manager
   - Build Command: npm run build
   - Start Command: npm run preview -- --host 0.0.0.0 --port $PORT
3. Go to "Variables" tab
4. Add this variable:
   
   VITE_API_BASE_URL=https://backend-xxxx.up.railway.app/api
   
   (Use the backend domain from previous step)

5. Click "Deploy"
6. Wait for build to complete
```

### Action 5.6: Get Frontend Domain
```
1. In "team-task-manager" service, go to "Domains" tab
2. Click "Generate Domain"
3. You'll get: frontend-xxxx.up.railway.app
4. THIS IS YOUR LIVE APP! 🎉
```

---

## STEP 6: Update Backend CORS_ORIGIN (Manual - 1 minute)

```
1. Go back to "backend" service
2. Go to "Variables" tab
3. Update CORS_ORIGIN:
   CORS_ORIGIN=https://frontend-xxxx.up.railway.app
   (Use the frontend domain from previous step)
4. Service will restart
```

---

## FINAL RESULT 🎉

**Your live application:**
```
Frontend: https://frontend-xxxx.up.railway.app ← Users open this!
Backend:  https://backend-xxxx.up.railway.app   ← API running here
Database: MongoDB Atlas (cloud)                  ← Data stored here
```

**Both auto-deploying from GitHub!**
```bash
# Any time you push code:
git push origin main

# Railway automatically rebuilds and deploys both!
```

---

## Summary of Actions

| Step | Action | Time | Automated? |
|------|--------|------|-----------|
| 1 | MongoDB Atlas setup | 5 min | ❌ Manual (browser) |
| 2 | Update .env files | 2 min | ✅ I'll do it |
| 3 | Test locally | 2 min | ❌ Manual (terminal) |
| 4 | Git push | 1 min | ❌ Manual (CLI) |
| 5 | Railway setup | 10 min | ❌ Manual (browser) |
| 6 | Final config | 1 min | ❌ Manual (browser) |
| **Total** | | **~20 min** | **Mostly manual** |

---

## What I'll Do Automatically:

✅ Update backend/.env with MongoDB URI
✅ Update team-task-manager/.env with API URL
✅ Verify code is ready
✅ Commit and push to GitHub

## What You Need to Do Manually:

❌ Create MongoDB Atlas account
❌ Create cluster and user
❌ Login to Railway
❌ Deploy to Railway
❌ Generate domains
❌ Set variables in Railway dashboard

---

## Ready? Let's Go!

**Next:** I'll update your .env files and push to GitHub.
Then you do the MongoDB → Railway steps following this guide.
