# 🎯 Deployment Checklist - Unified Railway Setup

## Read These Files in This Order

```
1. START_HERE_UNIFIED.md ⭐
   ↓
2. Choose your path:
   ├─ QUICK_UNIFIED_DEPLOYMENT.md (5 min) → If in hurry
   └─ UNIFIED_RAILWAY_DEPLOYMENT.md (15 min) → If want details
   ↓
3. ARCHITECTURE_DIAGRAM.md (Optional - understand design)
   ↓
4. Deploy! 🚀
```

---

## The 4 Main Steps (Every Deployment)

### ✅ Step 1: MongoDB Setup (5 minutes)
```
□ Go to: https://www.mongodb.com/cloud/atlas
□ Create account
□ Create FREE cluster
□ Create user "taskmanager"
□ Network: Allow 0.0.0.0/0
□ Get connection string
□ Copy: mongodb+srv://taskmanager:password@...
```

### ✅ Step 2: Update Your Code (2 minutes)
```
backend/.env:
  □ MONGODB_URI=mongodb+srv://...
  □ PORT=5000
  □ NODE_ENV=production
  
team-task-manager/.env:
  □ VITE_API_BASE_URL=https://backend-xxxx.up.railway.app/api
  
(Note: You get backend domain in Step 4)
```

### ✅ Step 3: Push to GitHub (1 minute)
```bash
□ git add .
□ git commit -m "Setup for Railway"
□ git push origin main
```

### ✅ Step 4: Deploy on Railway (5 minutes)
```
□ Go to: https://railway.app
□ Click: New Project
□ Select: Deploy from GitHub
□ Choose: Ethera_AI_Project
□ Wait for both services to build
□ Configure Backend Service:
  □ Add Domain
  □ Add Variables (MONGODB_URI, CORS_ORIGIN, etc)
□ Configure Frontend Service:
  □ Add Domain
  □ Add Variable (VITE_API_BASE_URL)
□ Both go live! ✅
```

---

## Pre-Flight Checklist

### Accounts Needed
- [ ] GitHub account (for code repo)
- [ ] MongoDB account (for database)
- [ ] Railway account (for deployment)

### Code Ready
- [ ] Frontend code in: team-task-manager/
- [ ] Backend code in: backend/
- [ ] package.json files exist
- [ ] Code runs locally (npm run dev, npm start)

### Environment Files
- [ ] backend/.env created
- [ ] team-task-manager/.env created
- [ ] Secrets NOT committed to git
- [ ] .gitignore file exists

---

## During Deployment

### Railway Dashboard

#### Backend Service Setup
```
□ Click "backend" service
□ Go to "Domains" → Generate Domain
  └─ Note: backend-xxxx.up.railway.app
□ Go to "Variables":
  □ PORT=5000
  □ NODE_ENV=production
  □ MONGODB_URI=mongodb+srv://...
  □ CORS_ORIGIN=https://frontend-xxxx.up.railway.app
  □ USE_JSON_DB=false
□ Service starts automatically
□ Wait for green "Running" status
```

#### Frontend Service Setup
```
□ Click "team-task-manager" service
□ Go to "Settings":
  □ Root Directory: team-task-manager
  □ Build Command: npm run build
  □ Start Command: npm run preview -- --host 0.0.0.0 --port $PORT
□ Go to "Domains" → Generate Domain
  └─ Note: frontend-xxxx.up.railway.app
□ Go to "Variables":
  □ VITE_API_BASE_URL=https://backend-xxxx.up.railway.app/api
□ Service starts automatically
□ Wait for green "Running" status
```

---

## Post-Deployment Verification

### Test Backend
```
□ Open in browser: https://backend-xxxx.up.railway.app
□ Should see: {"message":"Team Task Manager backend is running."}
□ Check: https://backend-xxxx.up.railway.app/api
```

### Test Frontend
```
□ Open in browser: https://frontend-xxxx.up.railway.app
□ Should see: Your app login page
□ Try: Click buttons, navigate
□ Check browser console: No CORS errors
```

### Test Connection
```
□ Open frontend
□ Try login with test account
□ Should work without errors
□ Check browser Network tab: API calls succeed
□ Check browser Console: No 404 or CORS errors
```

### Test Database
```
□ Frontend: Create new account
□ Frontend: Login with new account
□ Frontend: Create a task
□ Backend logs: Should show successful queries
□ MongoDB Atlas: Check collection has data
```

---

## Troubleshooting Checklist

### Frontend Won't Load
```
□ Check URL is correct: https://frontend-xxxx.up.railway.app
□ Check Railway logs: Service → Logs
□ Check build errors: Look for "npm run build" errors
□ Check Node version: Should be 16+ (Railway shows this)
□ Fix: Commit → git push → Auto-redeploys
```

### Backend Won't Start
```
□ Check URL is correct: https://backend-xxxx.up.railway.app
□ Check Railway logs: Service → Logs → Look for MongoDB error
□ Check MONGODB_URI: Is it correct?
□ Check MongoDB Atlas: Is network access 0.0.0.0/0?
□ Fix: Update variables → Service restarts
```

### Frontend Can't Reach Backend
```
□ Check VITE_API_BASE_URL in frontend .env
□ Check backend CORS_ORIGIN in Railway variables
□ Check both domains are correct
□ Browser console: Exact error message?
□ Check backend is running: Open backend URL
□ Fix: Update variables → Restart services
```

### API Errors
```
□ Open browser Console (F12)
□ Check exact error message
□ Check backend logs for API error
□ Check MongoDB connection in backend logs
□ Check request/response in Network tab
□ Fix: Update code → git push → Auto-redeploys
```

---

## Success Indicators

### ✅ Everything Working When:
```
✅ Frontend URL opens without errors
✅ See login page in browser
✅ Can type in login form
✅ Try login → Call goes to backend (Network tab)
✅ Backend responds (API working)
✅ User created in MongoDB (data saved)
✅ Can login with account
✅ Can create tasks/projects
✅ Data persists (refresh page - still there)
✅ Both services show "Running" status
```

### ❌ Something Wrong If:
```
❌ Frontend shows blank page
❌ "Cannot GET /"
❌ Console shows CORS errors
❌ Network shows 404 on API calls
❌ Cannot login even with correct password
❌ Service shows "Crashed" or "Failed"
❌ Railway shows build errors
```

---

## Your Final URLs

### To Access Your App:
```
Frontend: https://frontend-[random].up.railway.app
         👆 Share this with users!
         
Backend:  https://backend-[random].up.railway.app
         👆 Used by frontend internally
```

### To Access Dashboard:
```
Railway:  https://railway.app
         👆 Manage deployment here
         
MongoDB:  https://www.mongodb.com/cloud/atlas
         👆 View database here
```

---

## After Deployment

### Updating Your App
```bash
# Make changes to code
# Test locally

git add .
git commit -m "Update feature"
git push origin main

# Railway auto-deploys! ⚡
# Check Railway dashboard for status
# Takes 2-3 minutes
```

### Monitoring
```
Railway Dashboard:
□ Watch "Deployments" tab
□ Check logs for errors
□ Monitor CPU/Memory usage
□ Check service status

MongoDB Atlas:
□ View data collections
□ Check backup status
□ Monitor disk usage
```

### Scaling Up
```
When you need more power:
□ Railway → Service → Settings → Resources
□ Upgrade memory/CPU if needed
□ MongoDB → Upgrade cluster tier
□ Auto-scales when traffic grows
```

---

## Common Commands

```bash
# Test locally before deploying
npm run start:backend                   # Terminal 1
npm run start:frontend                  # Terminal 2

# Build for production
npm run build:frontend
npm run build:backend

# Push changes (auto-deploys on Railway)
git push origin main

# Check status
# Open Railway dashboard and watch deployments
```

---

## Final Checklist

Before you start:
- [ ] All 3 accounts created (GitHub, MongoDB, Railway)
- [ ] Code ready locally
- [ ] .env files created

During setup:
- [ ] MongoDB cluster running
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Railway
- [ ] Both services show "Running"

After setup:
- [ ] Frontend URL works
- [ ] Backend URL works
- [ ] Login works
- [ ] Data saves to MongoDB
- [ ] Happy coding! 🎉

---

## 🎯 Next Step

👉 **Open: START_HERE_UNIFIED.md**

That's your entry point. It will guide you to either:
- QUICK guide (5 min) - if in hurry
- DETAILED guide (15 min) - if want to understand

**Let's deploy! 🚀**
