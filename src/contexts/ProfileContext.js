import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, update, set } from "firebase/database";

const ProfileContext = createContext({
  getProfile: () => Promise,
  updateProfile: () => Promise,
});

export const useProfile = () => useContext(ProfileContext);

export default function ProfileContextProvider({ children }) {
  const [profile, setProfile] = useState(null);
  function updateProfile(data) {
    try {
      const user = getAuth().currentUser;
      const db = getDatabase();
      const profileRef = ref(db, `attend-it/${user?.uid}/profile`);
      return update(profileRef, data);
    } catch (error) {
      console.log(error);
    }
  }
  function getProfile() {
    try {
      if (getAuth()) {
        const user = getAuth().currentUser;
        const db = getDatabase();
        const profileRef = ref(db, `attend-it/${user?.uid}/profile`);
        return onValue(profileRef, (snapshot) => {
          if (snapshot.exists()) setProfile(snapshot.val());
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  const value = { profile, getProfile, updateProfile };
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
