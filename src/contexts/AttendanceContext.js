import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebase_config";
import { set, ref, getDatabase, onValue, get, child } from "firebase/database";

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export default function AttendanceContextProvider({ children }) {
  const [currPath, setCurrPath] = useState("");
  const [liveAttendance, setliveAttendance] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [availableSems, setAvailableSems] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [callback, setCallback] = useState(false);
  const [attendanceFetchPath, setAttendanceFetchPath] = useState("");
  const [fetchedSessions, setFetchedSessions] = useState([]);
  const [fetchedData, setFetchedData] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [selectedSession, setSelectedSession] = React.useState("");

  const fetchSessions = () => {
    try {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "attend-it" + "/" + auth?.currentUser?.uid + "/" + attendanceFetchPath)).then((snapshot) => {
        if (!snapshot.exists()) {
          console.log("Attendance does not exist on selected date!");
          setAttendance([]);
          setFetchedSessions([]);
          setFetchedData("");
        } else {
          setFetchedData(snapshot.val());
          setFetchedSessions(Object.keys(snapshot.val()));
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchAttendance = (session) => {
    try {
      setAttendance(Object.values(fetchedData[`${session}`]));
      setSelectedSession(new Date(session / 60).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLiveAttendance = () => {
    const userRef = ref(getDatabase(), "attend-it" + "/" + auth?.currentUser.uid + "/" + currPath);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      let temp = [];
      Object.values(data).map((i) => temp.push(i));
      setliveAttendance(temp);
    });
  };
  const fetchCourseDetails = () => {
    try {
      if (!auth) return;
      const userRef = ref(getDatabase(), "attend-it" + "/" + auth?.currentUser.uid + "/" + "profile");
      onValue(userRef, (snapshot) => {
        setAvailableCourses(snapshot.val()?.courses);
        setAvailableSems(snapshot.val()?.semesters);
        setAvailableSubjects(snapshot.val()?.subjects);
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  //to get live attendance
  useEffect(() => {
    if (currPath?.trim() !== "") {
      getLiveAttendance();
    }
  }, [currPath]);

  const value = { liveAttendance, setCurrPath,selectedSession,  availableCourses, availableSems, availableSubjects, setCallback, callback, setAttendanceFetchPath, fetchedSessions, fetchAttendance, attendance, setAttendance, fetchCourseDetails, fetchSessions, attendanceFetchPath };
  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}
