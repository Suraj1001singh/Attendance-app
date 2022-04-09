import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCg-lNabkEo1bN5YPnQO_FchR2g8YWm_iw",
  authDomain: "attend-it-7255c.firebaseapp.com",
  projectId: "attend-it-7255c",
  storageBucket: "attend-it-7255c.appspot.com",
  messagingSenderId: "138451545848",
  appId: "1:138451545848:web:8426b46d52a492803e550d",
  measurementId: "G-N0Z4TBCC1Q",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
export { auth };
