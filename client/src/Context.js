import React, { useState } from "react";
import Cookies from "js-cookie";
import Data from "./Data";

const Context = React.createContext();

export function Provider({ children }) {
  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const cookie = Cookies.get("authenticatedUser");
    return cookie ? JSON.parse(cookie) : null;
  });

  const data = new Data();

  // Action - Sign In 'user' and provide Cookie
  // PARAMS - 'emailAddress' , 'password'
  const signIn = async (emailAddress, password) => {
    const user = await data.getUser(emailAddress, password);

    if (user !== null) {
      user.password = password;
      setAuthenticatedUser(user);

      const cookieOptions = {
        expires: 1,
      };

      Cookies.set("authenticatedUser", JSON.stringify(user), cookieOptions);
    }
    return user;
  };

  // Action - Sign Out 'user' and remove Cookie
  const signOut = () => {
    setAuthenticatedUser(null);
    Cookies.remove("authenticatedUser");
  };

  const value = {
    authenticatedUser,
    data,
    actions: {
      signIn,
      signOut,
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const { Consumer } = Context;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */
export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {(context) => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  };
}