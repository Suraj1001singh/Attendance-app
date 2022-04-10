import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase_config";
import { updateProfile
  , createUserWithEmailAndPassword, confirmPasswordReset, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
const AuthContext = createContext({
  currentUser: null,
  register: () => Promise,
  login: () => Promise,
  logout: () => Promise,
  signInWithGoogle: () => Promise,
  forgotPassword: () => Promise,
  resetPassword: () => Promise,
  updateProfile: () => Promise
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      console.log("unmounting ");
      return unsubscribe;
    };
  }, []);
  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  function logout() {
    return signOut(auth);
  }
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email, { url: "http://localhost:3000/login" });
  }
  function resetPassword(oobcode, newPassword) {
    return confirmPasswordReset(auth, oobcode, newPassword);
  }
  function updateUserProfile(name) {
    return updateProfile(auth.currentUser, {
      displayName: name,
    });
  }
  const value = { currentUser, register, login, logout, signInWithGoogle, forgotPassword, resetPassword, updateUserProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
