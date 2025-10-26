// src/utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBF8_Ghw4gX4gMwWV7DLjgNBMkTDO-x_oU",
  authDomain: "login-with-3090a.firebaseapp.com",
  projectId: "login-with-3090a",
  storageBucket: "login-with-3090a.appspot.com",
  messagingSenderId: "1039960591051",
  appId: "1:1039960591051:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Google Auth Provider
export const provider = new GoogleAuthProvider();