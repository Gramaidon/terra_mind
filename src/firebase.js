// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// PASTE CONFIG DARI FIREBASE CONSOLE DI SINI
const firebaseConfig = {
  apiKey: "AIzaSyD...", // Ganti dengan punya Anda
  authDomain: "terramind-....firebaseapp.com",
  projectId: "terramind-...",
  storageBucket: "terramind-....appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();