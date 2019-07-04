import React from "react";
import "./App.css";
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
import Footer from "./components/layouts/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";

import { BrowserRouter as Router, Route } from "react-router-dom";

import store from "./store";
import { Provider } from "react-redux";
import setAuthHeader from "./utils/setAuthHeader";
import jwt_decode from "jwt-decode";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
// this is required so that a page refresh reinstates the state back to the one before the refresh
if (localStorage.jwtToken) {
  setAuthHeader(localStorage.jwtToken);
  const user = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(user));

  // check if token has expired
  if (localStorage.jwtToken.exp < Date.now() / 1000) {
    store.dispatch(clearCurrentProfile());
    store.dispatch(logoutUser());
    window.location.href = "/login";
  }
}
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/dashboard" component={Dashboard} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
