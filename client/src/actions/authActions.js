import { GET_ERRORS } from "./types";
import axios from "axios";
// Contains actions that define the data required by the reducer to update state
// These just return constant objects which at least have a type and tell the reducer what to do
// The doing part is done by the reducer itself, not here

// Action to register the user, the UI calls it whenever it wants to register a user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("http://localhost:5000/api/users/register", userData)
    .then(res => history.push("/login")) // redirect to login
    .catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
  // when we get an error, we dispatch the GET_ERRORS action type to the reducer which then modifies the state
};
