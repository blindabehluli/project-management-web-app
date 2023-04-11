import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./components/Layout/NotFound";
import UserSignUp from "./components/User/UserSignUp";
import UserSignIn from "./components/User/UserSignIn";
import UserSignOut from "./components/User/UserSignOut";
import Authenticated from "./components/Authenticated";
import PrivateRoutes from "./components/PrivateRoutes";
import LandingPage from "./components/Layout/LandingPage";

const App = () => {
  return (
    <Router>
      <>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/signin" element={<UserSignIn />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/signout" element={<UserSignOut />} />
          <Route path="*" element={<NotFound />} />

          <Route element={<PrivateRoutes />} >
            <Route path="/authenticated" element={<Authenticated />} />
          </Route>
          
        </Routes>
      </>
    </Router>
  );
};

export default App;
