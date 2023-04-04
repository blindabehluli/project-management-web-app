import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "./Form";
import withContext from "../Context";

function UserSignUp(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  // Handles changes on the sign up input form texts and set state
  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "emailAddress":
        setEmailAddress(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  // Handles the submit form button for sign up
  // Checks for validation errors
  const handleSubmit = async () => {
    const { context } = props;

    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    try {
      const errors = await context.data.createUser(user);
      if (errors.length) {
        setErrors(errors);
      } else {
        await context.actions.signIn(emailAddress, password);
        navigate("/authenticated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="">
      <h2>Sign Up</h2>
      <Form
        cancel={handleCancel}
        errors={errors}
        submit={handleSubmit}
        submitButtonText="Sign Up"
        elements={() => (
          <>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={firstName}
              onChange={handleChange}
            />

            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={lastName}
              onChange={handleChange}
            />

            <label htmlFor="emailAddress">Email Address</label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="text"
              value={emailAddress}
              onChange={handleChange}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handleChange}
            />
          </>
        )}
      />

      <p>
        Already have a user account? <Link to="/signin">Click here</Link> to
        sign in!
      </p>
    </div>
  );
}

export default withContext(UserSignUp);