import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./components/ErrorPages/NotFound";
import LandingPage from "./components/LandingPage";
import Forbidden from "./components/ErrorPages/Forbidden";
import Error from "./components/ErrorPages/Error";
import UserSignUp from "./components/User/UserSignUp";
import UserSignIn from "./components/User/UserSignIn";
import UserSignOut from "./components/User/UserSignOut";
import Dashboard from "./components/Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<UserSignIn />} />
      <Route path="/signup" element={<UserSignUp />} />
      <Route path="/signout" element={<UserSignOut />} />
      <Route path="*" element={<NotFound />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/error" element={<Error />} />
    </Routes>
  );
};

export default App;
