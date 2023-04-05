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
    <div className="flex justify-center items-center h-full">
      <div className="w-full max-w-xs">
        <h2 className="text-center text-2xl font-bold mb-4">Sign Up</h2>
        <Form
          cancel={handleCancel}
          errors={errors}
          submit={handleSubmit}
          submitButtonText="Sign Up"
          elements={() => (
            <>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="emailAddress" className="block text-gray-700 font-bold mb-2">Email Address</label>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  value={emailAddress}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </>
          )}
        />

        <p>
          Already have a user account? <Link to="/signin" className="text-blue-500 hover:underline">Click here</Link> to
          sign in!
        </p>
      </div>
    </div>
  );
}

export default withContext(UserSignUp);