import { useContext, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import ErrorsDisplay from "../ErrorsDisplay";
import UserContext from '../../context/UserContext';

function UserSignIn() {
  const { actions } = useContext(UserContext)
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const emailAddress= useRef(null);
  const password = useRef(null);
  const [errors, setErrors] = useState([]);

// Event Handlers
const handleSubmit = async (event) => {
  event.preventDefault();
  let from = '/workspace';
  if (location.state) {
    from = location.state.from;
  }

  const credentials = {
    emailAddress: emailAddress.current.value,
    password: password.current.value
  };

  try {
    const user = await actions.signIn(credentials);
    if (user) {
      navigate(from);
    } else {
      setErrors(["Sign-in was unsuccessful"]);
    }
  } catch (error) {
    console.log(error);
    navigate("/error");
  }
}

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          G
          <img className="w-8 h-8 mx-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          B
        </Link>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <ErrorsDisplay errors={errors} />
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                <input type="email" name="emailAddress" id="email" ref={emailAddress}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@company.com" />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input type="password" name="password" ref={password} id="password" placeholder="••••••••"
                 className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              </div>
              <div className="flex flex-col space-y-4">
              <button type="submit" className="w-full text-white bg-[#303030] hover:bg-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>
              </div>
              <p className="text-sm font-light text-gray-500">
                Don’t have an account yet? <Link to="/signup" className="font-medium text-[#303030] hover:underline">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserSignIn;