import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Public from "./components/Public";
import NotFound from "./components/NotFound";
import UserSignUp from "./components/UserSignUp";
import UserSignIn from "./components/UserSignIn";
import UserSignOut from "./components/UserSignOut";
import Authenticated from "./components/Authenticated";
import PrivateRoutes from "./PrivateRoute";

const App = () => {
  return (
    <Router>
      <>
        <Header />
        <Routes>
          <Route exact path="/" element={<Public />} />
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
