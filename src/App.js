import "./App.css";
import AppRouter from "./components/Routes/AppRouter";
import AuthContextProvider from "./contexts/AuthContext";
import ProfileContextProvider from "./contexts/ProfileContext";

function App() {
  return (
    <AuthContextProvider>
      <ProfileContextProvider>
      <AppRouter />
      </ProfileContextProvider>
    </AuthContextProvider>
  );
}

export default App;
