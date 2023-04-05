import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Consumer } from "./Context";

// Component to handle Private Routes
const PrivateRoutes = ({ children }) => {
  const location = useLocation();

  return (
    <Consumer>
      {({ authenticatedUser }) => authenticatedUser ? (
        <Outlet>{children}</Outlet>
      ) : (
        <Navigate to={{ pathname: "/signin", state: { from: location } }} replace />
      )}
    </Consumer>
  );
};

export default PrivateRoutes;