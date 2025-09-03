// firebase/config.jsx
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For development, you can hardcode the config or use import.meta.env for Vite
const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyACegEEmlkvupRtBHd9K69wSw2mkYUSD74",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "ai-migos-2f390.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "ai-migos-2f390",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "ai-migos-2f390.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "577385561736",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:577385561736:web:0021b342373f07aecf693d",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-FLCR5VCE9R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Firestore Database
export const db = getFirestore(app);

export default app;