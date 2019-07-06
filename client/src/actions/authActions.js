import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import setAuthHeader from "../utils/setAuthHeader";

const productionURLPref = "";
const devURLPref = "http://localhost:5000";
const isDev = process.env.NODE_ENV === "development";

// Contains actions that define the data required by the reducer to update state
// These just return constant objects which at least have a type and tell the reducer what to do
// The doing part is done by the reducer itself, not here

// Action to register the user, the UI calls it whenever it wants to register a user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post(`${isDev ? devURLPref : ""}/api/users/register`, userData)
    .then(res => history.push("/login")) // redirect to login
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
  // when we get an error, we dispatch the GET_ERRORS action type to the reducer which then modifies the state
};

// Login User
export const loginUser = userData => dispatch => {
  axios
    .post(`${isDev ? devURLPref : ""}/api/users/login`, userData)
    .then(res => {
      const { token } = res.data;
      // save the token to localstorage
      localStorage.setItem("jwtToken", token);

      // set Authorization header
      setAuthHeader(token);

      // decode user from token
      const user = jwtDecode(token);
      // call another action ot set current user
      return dispatch(setCurrentUser(user));
    })
    .catch(err => {
      console.log(err);
      return dispatch({
        type: GET_ERRORS,
        payload: err.response ? err.response.data : {}
      });
    });
};

// Set current User
export const setCurrentUser = user => ({
  type: SET_CURRENT_USER,
  payload: user
});

export const logoutUser = () => dispatch => {
  // remove token from localstorage
  localStorage.removeItem("jwtToken");

  // remove the auth header
  setAuthHeader(false);
  // dispatch another action to set current user on the global state to null
  dispatch({
    type: SET_CURRENT_USER,
    payload: {}
  });
};
