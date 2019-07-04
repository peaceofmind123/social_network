import * as actionTypes from "../actions/types";

const initialState = {
  profile: null, // the currently displayed profile
  profiles: null, // the profiles of all the users on the website
  loading: false // indicates whether profile is loading or not
};
export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PROFILE_LOADING:
      return { ...state, loading: true };

    case actionTypes.GET_PROFILE:
      return { ...state, profile: action.payload, loading: false };
    case actionTypes.CLEAR_CURRENT_PROFILE:
      return { ...state, profile: null };

    case actionTypes.ADD_PROFILE:
      return { ...state, profile: action.payload };
    default:
      return state;
  }
}
