import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Public from "./components/Public";
import NotFound from "./components/NotFound";
import UserSignUp from "./components/UserSignUp";
import UserSignIn from "./components/UserSignIn";
import UserSignOut from "./components/UserSignOut";
import Authenticated from "./components/Authenticated";

const App = () => {
  return (
    <Router>
      <>
        <Header />
        <Routes>
          <Route exact path="/" element={<Public />} />
          <Route path="/authenticated" element={<Authenticated />} />
          <Route path="/signin" element={<UserSignIn />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/signout" element={<UserSignOut />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    </Router>
  );
};

export default App;
