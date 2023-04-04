import React from "react";
import { Route } from "react-router-dom";
import { Consumer } from "./Context";
import { Navigate } from "react-router-dom";

// Component to handle Private Routes
const PrivateRoute = ({ children, ...rest }) => {
  return (
    <Consumer>
      {(context) => (
        <Route
          {...rest}
          element={
            context.authenticatedUser ? (
              children
            ) : (
              <Navigate
                to={{
                  pathname: "/signin",
                  state: { from: rest.location },
                }}
              />
            )
          }
        />
      )}
    </Consumer>
  );
};

export default PrivateRoute;