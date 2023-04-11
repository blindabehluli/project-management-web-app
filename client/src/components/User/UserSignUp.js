import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorsDisplay from "../ErrorsDisplay/ErrorsDisplay";
import withContext from "../../context/AuthContext";

function UserSignUp(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  // Handles changes on the sign up input form texts and set state
  const change = (event) => {
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
  const handleSubmit = async (event) => {
    event.preventDefault();
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

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          G & B
        </Link>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign up now
            </h1>
            <ErrorsDisplay errors={errors} />
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 pr-2">
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900">First Name</label>
                <input type="text" name="firstName" id="firstName" value={firstName} onChange={change} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5" placeholder="Blinda" />
              </div>
              <div className="w-full md:w-1/2 pl-2">
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">Last Name</label>
                <input type="text" name="lastName" id="lastName" value={lastName} onChange={change} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5" placeholder="Behluli" />
              </div>
            </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input type="email" name="emailAddress" id="email" value={emailAddress} onChange={change} 
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input type="password" name="password" value={password} onChange={change} id="password" placeholder="••••••••"
                 className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              </div>
              <div className="flex flex-col space-y-4">
              <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>
              </div>
              <p className="text-sm font-light text-gray-500">
                Already have an account? <Link to="/signin" className="font-medium text-primary-600 hover:underline">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default withContext(UserSignUp);
