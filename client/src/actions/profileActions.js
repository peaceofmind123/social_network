import axios from "axios";
import * as actionTypes from "./types";

const devURLPref = "http://localhost:5000";
const isDev = process.env.NODE_ENV === "development";

// get the profile of the currently logged in user
export const getCurrentProfile = () => dispatch => {
  // update the state to reflect that the profile is being loaded
  dispatch(profileLoading());

  axios
    .get(`${isDev ? devURLPref : ""}/api/profile`)
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILE, // update the state to reflect that the profile is recieved
        payload: res.data
      })
    )
    .catch(err =>
      // the user doesn't have a profile yet, update state accordingly
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: {}
      })
    );
};

// dispatch the loading action
export const profileLoading = () => ({
  type: actionTypes.PROFILE_LOADING
});

// clear current profile (required on logout)
export const clearCurrentProfile = () => ({
  type: actionTypes.CLEAR_CURRENT_PROFILE
});

// add a new profile

export const addProfile = (profileData, history) => dispatch => {
  axios
    .post(`${isDev ? devURLPref : ""}/api/profile`, profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({ type: actionTypes.GET_ERRORS, payload: err.response.data })
    );
};

// delete the entire user account
export const deleteAccount = () => dispatch => {
  if (!window.confirm("This cannot be undone. Are you sure?")) return;
  axios
    .delete(`${isDev ? devURLPref : ""}/api/users`)
    .then(res =>
      dispatch({
        type: actionTypes.SET_CURRENT_USER,
        payload: {} //this will log the user out
      })
    )
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get profile by handle
export const getProfileByHandle = handle => dispatch => {
  dispatch(profileLoading());
  axios
    .get(`${isDev ? devURLPref : ""}/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: null
      })
    );
};

// Add experience
export const addExperience = (expData, history) => dispatch => {
  axios
    .post(`${isDev ? devURLPref : ""}/api/profile/experience`, expData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add education
export const addEducation = (eduData, history) => dispatch => {
  axios
    .post(`${isDev ? devURLPref : ""}/api/profile/education`, eduData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Experience
export const deleteExperience = id => dispatch => {
  axios
    .delete(`${isDev ? devURLPref : ""}/api/profile/experience/${id}`)
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Education
export const deleteEducation = id => dispatch => {
  axios
    .delete(`${isDev ? devURLPref : ""}/api/profile/education/${id}`)
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: actionTypes.GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get all profiles
export const getProfiles = () => dispatch => {
  dispatch(profileLoading());
  axios
    .get(`${isDev ? devURLPref : ""}/api/profile/all`)
    .then(res =>
      dispatch({
        type: actionTypes.GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: actionTypes.GET_PROFILES,
        payload: null
      })
    );
};
