import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration using environment variables
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseEnabled = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId &&
  !firebaseConfig.apiKey.includes("your_") &&
  !firebaseConfig.authDomain.includes("your_")
);

let app;
let auth;

if (firebaseEnabled) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else {
  console.warn("Firebase not configured. Please set up environment variables.");
}

export { auth };
export default app;
