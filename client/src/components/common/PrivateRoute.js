// This is an extension to the Route component of react-router-dom
// This enables authentication checking before allowing the user to access private route

import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import React, { Component } from "react";
import PropTypes from "prop-types";
function PrivateRoute({ component: Component, auth, ...rest }) {
  // the component to load if authenticated,
  // the auth state that tells the router if the user is authenticated (comes from react-redux)
  // and the rest of the arguments passed down to the Route component

  return (
    <Route
      {...rest}
      render={props => {
        if (auth.isAuthenticated) return <Component {...props} />;
        else return <Redirect to="/login" />;
      }}
    />
  );
}
const mapStateToProps = state => ({
  auth: state.auth
});
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};
export default connect(mapStateToProps)(PrivateRoute);
