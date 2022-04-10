import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Home from "../Pages/Home/Home";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Login from "../Pages/AuthPages/Login/Login";
import Register from "../Pages/AuthPages/Register/Register";
import ForgetPassword from "../Pages/AuthPages/ForgetPassword/ForgetPassword";
import ResetPassword from "../Pages/AuthPages/ResetPassword/ResetPassword";
import NotFoundPage from "../Pages/NotFoundPage/NotFoundPage";
import Profile from "../Pages/Profile/Profile";
import Navbar from "../Navbar/Navbar";
const AppRouter = () => {
  const { currentUser } = useAuth();
  return (
    <>
      <Router>
        {currentUser && <Navbar />}
        <Switch>
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/login" component={Login} />
          <ProtectedRoute exact path="/register" component={Register} />
          <ProtectedRoute exact path="/profile" component={Profile} />
          <ProtectedRoute exact path="/protected-page" component={Dashboard} />
          <ProtectedRoute exact path="/forgot-password" component={ForgetPassword} />
          <ProtectedRoute exact path="/reset-password" component={ResetPassword} />
          <Route exact path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    </>
  );
  function ProtectedRoute(props) {
    const { currentUser } = useAuth();
    const location = useLocation();
    const { path } = props;
    if (path === "/login" || path === "/register" || path === "/forgot-password" || path === "/reset-password") {
      return currentUser ? <Redirect to={location.state?.from ?? "/profile"} /> : <Route {...props} />;
    }
    return currentUser ? (
      <Route {...props}></Route>
    ) : (
      <Redirect
        to={{
          pathname: "/login",
          state: { from: path },
        }}
      />
    );
  }
};
export default AppRouter;
