import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase_config";
import { set, ref, getDatabase, onValue } from "firebase/database";
import { onAuthStateChanged } from "@firebase/auth";
const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export default function AttendanceContextProvider({ children }) {
  const [currPath, setCurrPath] = useState("");
  const [liveAttendance, setliveAttendance] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableSems, setAvailableSems] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [callback, setCallback] = useState(false);

  const getLiveAttendance = () => {
    const userRef = ref(getDatabase(), "attend-it" + "/" + auth?.currentUser.uid + "/" + currPath);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      let temp = [];
      Object.values(data).map((i) => temp.push(i));
      setliveAttendance(temp);
    });
  };
  const fetchCourses = () => {
    try {
      if (!auth) return;
      const userRef = ref(getDatabase(), "attend-it" + "/" + auth?.currentUser.uid + "/" + "profile" + "/" + "courses");
      onValue(userRef, (snapshot) => {
        setAvailableCourses(snapshot.val());
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  const fetchSems = () => {
    try {
      if (!auth) return;
      const userRef = ref(getDatabase(), "attend-it" + "/" + auth?.currentUser.uid + "/" + "profile" + "/" + "semesters");
      onValue(userRef, (snapshot) => {
        setAvailableSems(snapshot.val());
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  const fetchSubjects = () => {
    try {
      if (!auth) return;
      const userRef = ref(getDatabase(), "attend-it" + "/" + auth?.currentUser.uid + "/" + "profile" + "/" + "subjects");
      onValue(userRef, (snapshot) => {
        setAvailableSubjects(snapshot.val());
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSems();
    fetchSubjects();
  }, [callback]);
  //to get live attendance
  useEffect(() => {
    if (currPath?.trim() !== "") {
      getLiveAttendance();
    }
  }, [currPath]);

  const value = { liveAttendance, setCurrPath, availableCourses, availableSems, availableSubjects, setCallback, callback };
  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}
