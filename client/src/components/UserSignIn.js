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
    <div className="f">
      <h2>Sign In</h2>

      <Form
        cancel={cancel}
        errors={errors}
        submit={submit}
        submitButtonText="Sign In"
        elements={() => (
          <>
            <label htmlFor="emailAddress"></label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="text"
              value={emailAddress}
              onChange={change}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={change}
            />
          </>
        )}
      />

      <p>
        Don't have a user account? <Link to="/signup">Click here</Link> to sign
        up!
      </p>
    </div>
  );
}

export default withContext(UserSignIn);