import "./App.css";
import AppRouter from "./components/Routes/AppRouter";
import AuthContextProvider from "./contexts/AuthContext";
import ProfileContextProvider from "./contexts/ProfileContext";
import AttendanceContextProvider from "./contexts/AttendanceContext";

function App() {
  return (
    <AuthContextProvider>
      <AttendanceContextProvider>
      <ProfileContextProvider>
      <AppRouter />
      </ProfileContextProvider>
      </AttendanceContextProvider>
    </AuthContextProvider>
  );
}

export default App;
