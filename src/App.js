import "./App.css";
import AppRouter from "./components/Routes/AppRouter";
import AuthContextProvider from "./contexts/AuthContext";
import AttendanceContextProvider from "./contexts/AttendanceContext";

function App() {
  return (
    <AuthContextProvider>
      <AttendanceContextProvider>
        <AppRouter />
      </AttendanceContextProvider>
    </AuthContextProvider>
  );
}

export default App;
