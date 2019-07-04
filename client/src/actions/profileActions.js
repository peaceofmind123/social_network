import axios from "axios";
import * as actionTypes from "./types";
// get the profile of the currently logged in user
export const getCurrentProfile = () => dispatch => {
  // update the state to reflect that the profile is being loaded
  dispatch(profileLoading());

  axios
    .get("http://localhost:5000/api/profile")
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
    .post("http://localhost:5000/api/profile", profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({ type: actionTypes.GET_ERRORS, payload: err.response.data })
    );
};

// delete the entire user account
export const deleteAccount = () => dispatch => {
  if (!window.confirm("This cannot be undone. Are you sure?")) return;
  axios
    .delete("http://localhost:5000/api/users")
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
