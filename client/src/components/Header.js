import React from "react";
import { Link } from "react-router-dom";
import withContext from "../Context";

class Header extends React.PureComponent {
  static defaultProps = {
    context: {},
  };
  render() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    return (
      <div className="bg-indigo-500 flex justify-between items-center py-8 px-12 text-white font-bold">
        <h1>Testing Authentication</h1>
        <nav className="mx-2">
          {authUser ? (
            <>
              <span>Welcome, {authUser.firstName}!</span>
              <Link to="/signout" className="ml-2">Sign Out</Link>
            </>
          ) : (
            <>
              <Link className="mr-2" to="/signup">
                Sign Up
              </Link>
              <Link className="ml-2" to="/signin">
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    );
  }
}

export default withContext(Header);
