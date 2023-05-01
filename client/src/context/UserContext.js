import { createContext, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../utils/apiHelper";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  const authCookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(authCookie ? JSON.parse(authCookie) : null);
  const credentialsCookie = Cookies.get("credentials");
  const [credentials, setCredentials] = useState(credentialsCookie ? JSON.parse(credentialsCookie) : null);

  const signIn = async (credentials) => {
    const response = await api("/users", "GET", null, credentials);
    if (response.status === 200) {
      const user = await response.json();
      // if sign in is successful, update state and cookies
      setAuthUser(user);
      Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
      setCredentials(credentials);
      Cookies.set("credentials", JSON.stringify(credentials), { expires: 1 });
      return user;
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  };

  const signOut = () => {
        // remove state and cookies
    setAuthUser(null);
    Cookies.remove("authenticatedUser");

    setCredentials(null);
    Cookies.remove("credentials");
  };

  return (
    <UserContext.Provider
      value={{
        credentials,
        authUser,
        actions: {
          signIn,
          signOut,
        },
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
