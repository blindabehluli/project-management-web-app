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
      <div className="">
        <div className="">
          <h1 className="">Testin Authentication</h1>
          <nav>
            {authUser ? (
              <>
                <span>Welcome, {authUser.name}!</span>
                <Link to="/signout">Sign Out</Link>
              </>
            ) : (
              <>
                <Link className="signup" to="/signup">
                  Sign Up
                </Link>
                <Link className="signin" to="/signin">
                  Sign In
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    );
  }
}

export default withContext(Header);
