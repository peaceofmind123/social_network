import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
class Navbar extends Component {
  onLogout = e => {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push("/login");
  };
  render() {
    const { isAuthenticated, user } = this.props.auth;

    const navAuthenticated = (
      <li className="nav-item">
        <a className="nav-link" onClick={this.onLogout}>
          <span>
            <img
              style={{
                width: "1rem",
                height: "1rem",
                marginRight: "10px",
                display: "inline"
              }}
              className="rounded-circle"
              src={user.avatar}
              alt="Gravatar"
              title="Please link a valid gravatar email to see the avatar"
            />
          </span>
          Logout
        </a>
      </li>
    );

    const navGuest = (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Log In
          </Link>
        </li>
      </>
    );
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">
            DevConnector
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/profiles">
                  {" "}
                  Developers
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav ml-auto">
              {isAuthenticated ? navAuthenticated : navGuest}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navbar));
