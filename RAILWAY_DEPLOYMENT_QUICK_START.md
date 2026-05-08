# Quick Railway Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub repository
- [ ] Railway account created at railway.app
- [ ] MongoDB account (Atlas) created OR Railway project ready

---

## 🗄️ Step 1: Setup MongoDB (5 minutes)

### Using MongoDB Atlas (FREE):
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up and create free account
3. Create cluster (free tier)
4. Create database user:
   - Username: taskmanager
   - Password: (strong password)
5. Network Access: Add IP 0.0.0.0/0 (allow all for Railway)
6. Click "Connect" → "Drivers"
7. Copy connection string
8. Replace <password> with your password
9. Save the URI for Step 3
```

**Connection String Format:**
```
mongodb+srv://taskmanager:yourpassword@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
```

---

## 🚀 Step 2: Deploy to Railway

### A. Login & Create Project
```
1. Go to https://railway.app
2. Login with GitHub
3. Create New Project
4. Select "Deploy from GitHub"
5. Connect your GitHub account
6. Select your repository
7. Select the entire project (not just a folder)
```

### B. Create Backend Service
```
1. Railway Dashboard → Add Service
2. Select your GitHub repository
3. Name: "backend" or "api"
4. Root Directory: backend/
5. Wait for initial build
```

### C. Configure Backend Environment Variables
```
In Railway → backend service → Variables:

PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://taskmanager:yourpassword@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority
USE_JSON_DB=false
CORS_ORIGIN=https://your-frontend-domain.up.railway.app
```

### D. Add Backend Domain
```
1. Railway → backend service → Domains
2. Click "Generate Domain"
3. Railway will create: backend-xxxx.up.railway.app
4. Copy this URL - you'll need it for frontend
```

### E. Create Frontend Service
```
1. Same project → Add Service
2. Select same GitHub repository
3. Name: "frontend" or "web"
4. Root Directory: team-task-manager/
5. Build Command: npm run build
6. Start Command: npm run preview -- --host 0.0.0.0 --port $PORT
7. Wait for build
```

### F. Configure Frontend Environment Variables
```
In Railway → frontend service → Variables:

VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api
```

Replace `your-backend-domain` with the domain from Step D (e.g., backend-xxxx.up.railway.app)

### G. Add Frontend Domain
```
1. Railway → frontend service → Domains
2. Click "Generate Domain"
3. This is your public URL: https://frontend-xxxx.up.railway.app
```

---

## 📝 Step 3: Update Code

### Update backend/server.js CORS
Replace the allowedOrigins with:
```javascript
const allowedOrigins = [
  process.env.CORS_ORIGIN || "https://frontend-xxxx.up.railway.app",
  "http://localhost:5173",
  "http://localhost:3000"
];
```

### Push Changes to GitHub
```bash
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

Railway will auto-deploy! Check the "Deployments" tab for status.

---

## ✨ Final URLs

| Service | URL |
|---------|-----|
| Frontend | https://frontend-xxxx.up.railway.app |
| Backend API | https://backend-xxxx.up.railway.app/api |
| MongoDB | (Atlas cloud - managed) |

---

## 🔧 Troubleshooting

### Backend won't start
```
Check logs in Railway → backend → Logs
Common issues:
- MONGODB_URI incorrect
- PORT already in use
- Missing NODE_ENV
```

### Frontend shows API errors
```
- Check VITE_API_BASE_URL matches backend domain
- Check backend CORS_ORIGIN matches frontend domain
- Check browser console for specific errors
```

### MongoDB connection fails
```
- Verify connection string format
- Check MongoDB Atlas: Network Access → Allow 0.0.0.0/0
- Test URI locally with backend
```

### Builds failing
```
Check Railway logs for:
npm ERR! (check npm package versions)
Memory limits (use smaller builds)
Missing build dependencies
```

---

## 📞 Support Resources

- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Express.js: https://expressjs.com
- Vite: https://vitejs.dev

---

## 🎯 Commands for Local Testing

```bash
# Install all dependencies
npm install:all

# Start backend
npm run start:backend

# Start frontend (separate terminal)
npm run start:frontend

# Build frontend
npm run build:frontend
```

**Success!** Your app should now be live on Railway with MongoDB!
