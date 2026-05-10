# 🚀 Railway par Frontend aur Backend Deploy Karne ka Tarika

Yeh guide aapko batayegi ki kaise aap apne Frontend (React) aur Backend (Node.js) ko ek sath Railway par deploy kar sakte hain, aur MongoDB ko alag rakh sakte hain.

## Step 1: Code ko GitHub par Push karein
Kyunki Railway GitHub se code directly uthata hai, sabse pehle aapko apne saare code ko GitHub par upload karna hoga.
Apne terminal (VS Code) mein yeh commands chalayein:

```bash
git add .
git commit -m "Railway deployment setup"
git push origin main
```
*(Agar aapne abhi tak GitHub repository nahi banayi hai, toh pehle github.com par banayein aur connect karein)*

---

## Step 2: Railway par Project Banayein
1. [Railway.app](https://railway.app/) par jayein aur apne GitHub account se Login karein.
2. Dashboard par **"New Project"** par click karein.
3. **"Deploy from GitHub repo"** select karein.
4. Apna GitHub project (jaise `Ethera_AI_Project`) select karein.
5. Railway khud detect kar lega ki aapke project mein Frontend aur Backend dono hain. Isey Deploy hone dein.

---

## Step 3: Backend Setup aur Variables (Environment Variables)
Jab backend service deploy ho rahi ho:
1. Railway Dashboard mein **Backend** service par click karein.
2. **"Variables"** tab mein jayein aur `New Variable` par click karke yeh sab add karein:

   - **Variable Name:** `MONGODB_URI`
     **Value:** `mongodb+srv://Ankit:ankit123@cluster0.q9pzc4j.mongodb.net/team-task-manager?appName=Cluster0`
   
   - **Variable Name:** `PORT`
     **Value:** `5000`
   
   - **Variable Name:** `NODE_ENV`
     **Value:** `production`

3. Uske baad **"Networking"** ya **"Domains"** tab mein jayein aur **"Generate Domain"** par click karein. 
4. Railway aapko ek link dega (jaise `backend-xxx.up.railway.app`). Is link ko copy kar lein.

---

## Step 4: Frontend Setup
Ab Frontend service ko configure karte hain:
1. Railway Dashboard mein apni **Frontend (team-task-manager)** service par click karein.
2. **"Variables"** tab mein jayein aur yeh variable add karein:

   - **Variable Name:** `VITE_API_BASE_URL`
     **Value:** `https://<Aapke-Backend-Ka-Link>/api`
     *(Dhyan rahe: Yahan `<Aapke-Backend-Ka-Link>` ki jagah Step 3 wala link daalna hai, bina kisi angle bracket ke)*

3. Uske baad **"Domains"** tab mein jayein aur **"Generate Domain"** par click karein.
4. Railway aapko frontend ke liye bhi ek link dega.

---

## 🎉 Badhai Ho! (You are Done)
Thodi der mein jab dono services puri tarah se deploy ho jayengi (green checkmark aa jayega), toh aap apne Frontend wale link ko browser mein khol kar dekh sakte hain. 

Aapki website ab live hai, Frontend aur Backend dono ek sath chal rahe hain, aur MongoDB alag se securely connect ho gaya hai! Agar kisi step mein problem aaye, toh aap mujhse pooch sakte hain.

