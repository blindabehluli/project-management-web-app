import React, { useState } from "react";
import Form from "./Form";
import { Link, useNavigate } from "react-router-dom";
import withContext from "../Context";

function UserSignIn(props) {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  function change(event) {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "emailAddress") {
      setEmailAddress(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  function submit() {
    const { context } = props;

    context.actions
      .signIn(emailAddress, password)
      .then((user) => {
        if (user === null) {
          setErrors(["Sign-in was unsuccessful"]);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function cancel() {
    navigate("/");
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-xs">
        <h2 className="text-center text-2xl font-bold mb-4">Sign In</h2>

        <Form
          cancel={cancel}
          errors={errors}
          submit={submit}
          submitButtonText="Sign In"
          elements={() => (
            <>
              <div className="mb-4">
                <label htmlFor="emailAddress" className="block text-gray-700 font-bold mb-2">Email Address</label>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  onChange={change}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={change}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </>
          )}
        />

        <p>
          Don't have a user account? <Link to="/signup" className="text-blue-500 hover:underline">Click here</Link> to sign up!
        </p>
      </div>
    </div>
  );
}

export default withContext(UserSignIn);