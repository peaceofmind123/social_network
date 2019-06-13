// this is our root reducer that combines all our other reducers
import { combineReducers } from "redux";
import authReducer from "./auth";
import errorReducer from "./errors";

// just combines all our reducers into one global reducer
export default combineReducers({
  auth: authReducer,
  errors: errorReducer
});
