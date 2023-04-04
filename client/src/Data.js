import config from "./config";
import Cookies from "js-cookie";

export default class Data {
  /*
    Handles the API request and responses
    and 'Credentials' parameters depending on API requests and responses.
    */
  api(
    path,
    method = "GET",
    body = null,
    requiresAuth = false,
    credentials = null
  ) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    // Checks if body is not null and Stringifies the content
    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    // Checks if authentication is required
    if (requiresAuth) {
      const encodedCredentials = btoa(
        `${credentials.emailAddress}:${credentials.password}`
      );
      options.headers["Authorization"] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }

  /*
    GET - User
    Auth - Yes
    Params - 'emailAddress', 'password'
    */
  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, "GET", null, true, {
      emailAddress,
      password,
    });
    if (response.status === 200) {
      // Converts data into JSON and return
      return response.json().then((data) => data);
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  }

  /*
    POST - New User
    Auth - No
    Params - user data
    */
  async createUser(user) {
    const response = await this.api("/users", "POST", user);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  /*
    Updates state with current user session cookie.
  */
  async updateSessionState(setAuthenticatedUser) {
    const cookie = Cookies.get("authenticatedUser");

    if (cookie) {
      const authenticatedUser = JSON.parse(cookie);
      setAuthenticatedUser(authenticatedUser);

      const response = await this.getUser(authenticatedUser.emailAddress, authenticatedUser.password);
      if (response === null) {
        setAuthenticatedUser(null);
        Cookies.remove("authenticatedUser");
      }
    }
  }
}