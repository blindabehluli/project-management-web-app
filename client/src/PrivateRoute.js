import React from "react";
import { Route, Navigate } from "react-router-dom";
import { Consumer } from "./Context";

// Component to handle Private Routes
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      {(context) => (
        <Route
          {...rest}
          element={(props) =>
            context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Navigate
                to={{
                  pathname: "/signin",
                  state: { from: props.location },
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