import { GET_ERRORS } from "../actions/types";
const initialErrorState = {};
export default function(state = initialErrorState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload; // this will be our entire error state
    default:
      // the default case is that we return the state as is, an identity reduction
      return state;
  }
}
