import React, { Component } from "react";
import Form from "./Form";
import { Link } from "react-router-dom";
import withContext from "../Context";

class UserSignIn extends Component {
  state = {
    emailAddress: "",
    password: "",
    errors: [],
  };

  render() {
    const { emailAddress, password, errors } = this.state;

    return (
      <div className="f">
        <h2>Sign In</h2>

        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Sign In"
          elements={() => (
            <>
              <label htmlFor="emailAddress"></label>
              <input
                id="emailAddress"
                name="emailAddress"
                type="text"
                value={emailAddress}
                onChange={this.change}
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={this.change}
              />
            </>
          )}
        />

        <p>
          Don't have a user account? <Link to="/signup">Click here</Link> to
          sign up!
        </p>
      </div>
    );
  }

  // Handles changes on the sign in input form texts and set state
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };

  // Handles the submit form button checks if user is authenticated to sign in
  submit = () => {
    const { context } = this.props;
    const { emailAddress, password } = this.state;

    context.actions
      .signIn(emailAddress, password)
      .then((user) => {
        if (user === null) {
          this.setState(() => {
            return { errors: ["Sign-in was unsuccessful"] };
          });
        } else {
          this.props.history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  cancel = () => {
    this.props.history.push("/");
  };
}

export default withContext(UserSignIn);