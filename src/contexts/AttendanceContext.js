import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase_config";
import { set, ref, getDatabase, onValue } from "firebase/database";
const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export default function AttendanceContextProvider({ children }) {
  const [currPath, setCurrPath] = useState("");
  const [liveAttendance, setliveAttendance] = useState("");

  const getLiveAttendance = () => {
    const userRef = ref(getDatabase(), "attend-it" + "/" + auth.currentUser.uid + "/" + currPath);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      let temp = [];
      Object.values(data).map((i) => temp.push(i));
      setliveAttendance(temp);
    });
  };
  //to get live attendance
  useEffect(() => {
    if (currPath?.trim() !== "") {
      getLiveAttendance();
    }
  }, [currPath]);

  const value = { liveAttendance, setCurrPath };
  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}
