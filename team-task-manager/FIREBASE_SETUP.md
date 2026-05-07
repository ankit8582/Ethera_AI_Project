# Firebase Authentication Setup Guide

## 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enter project name (e.g., "team-task-manager")
4. Enable Google Analytics if desired
5. Click "Create project"

## 2. Enable Authentication
1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## 3. Get Firebase Config
1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>)
4. Enter app nickname (e.g., "Team Task Manager Web")
5. Check "Also set up Firebase Hosting" if you plan to use it
6. Click "Register app"
7. Copy the config object values

## 4. Configure Environment Variables
1. Copy `.env` file and rename it to `.env.local`
2. Replace the placeholder values with your Firebase config:
   ```
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## 5. Deploy and Test
1. Build and deploy your application
2. Test registration and login functionality
3. Verify password reset works

## Security Notes
- Never commit `.env` files to version control
- Use Firebase Security Rules for database access
- Consider enabling additional security features like email verification