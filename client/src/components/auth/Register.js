import React, { Component } from "react";
import { withRouter } from "react-router-dom";

// in order to assign types to properties inserted by redux
import PropTypes from "prop-types";
// import the registerUser action
import { registerUser } from "../../actions/authActions";

// import connect that fills the props of the component with the redux stuff
// like the global state, the access to actions that the component can dispatch, etc.
import { connect } from "react-redux";

import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    password2: "",
    errors: {}
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const { name, email, password, password2 } = this.state;

    const newUser = { name, email, password, password2 };

    this.props.registerUser(newUser, this.props.history); // call the action to register the user
    // the second argument is just passing a function available to the component to the action, cuz it's the action that will redirect upon successfully registering.
  };

  componentWillReceiveProps(newProps) {
    // dynamically recieve the errors props upon getting errors
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      // no need to render this view for authenticated user
      this.props.history.push("/dashboard");
    }
  }

  render() {
    const { name, email, password, password2, errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="text"
                  error={errors.name}
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  type="email"
                  error={errors.password}
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  info="This site uses Gravatar so if you want a profile image, use
                    a Gravatar email"
                />
                <TextFieldGroup
                  type="password"
                  error={errors.password}
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  type="password"
                  error={errors.password2}
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  onChange={this.onChange}
                />

                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// define the proptypes
Register.propTypes = {
  auth: PropTypes.object.isRequired,
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

// map a part of the global state to the component props
const mapStateToProps = state => ({ auth: state.auth, errors: state.errors });
// connects the component with Redux
export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
// the with router is required to access the react-router functions in the actions,
// in case we need to redirect, etc.
// the second param maps the dispatchers to props on the component
