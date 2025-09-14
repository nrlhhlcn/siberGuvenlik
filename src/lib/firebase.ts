import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase konfigürasyonu
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCaxCcrREYrytAhq7VsHxTNQDZmO8xxzfw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "siberguvenlik-51844.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "siberguvenlik-51844",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "siberguvenlik-51844.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123193308140",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123193308140:web:1fcf9b7fa2104ec37146c9"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Servisleri export et
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
