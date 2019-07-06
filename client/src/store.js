import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialGlobalState = {}; // initially, the app starts fresh
// note that the init states seen in redux devtools is due to our other reducers
// for eg, auth, which has an initial state which it adds on to the global state

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialGlobalState,
  applyMiddleware(...middleware)
  // process.env.NODE_ENV === "production"
  //   ? applyMiddleware(...middleware)
  //   : compose(
  //       // this performs mathematical composition to the two functions
  //       applyMiddleware(...middleware),
  //       window.__REDUX_DEVTOOLS_EXTENSION__ &&
  //         window.__REDUX_DEVTOOLS_EXTENSION__() // the devtools extension function
);
export default store;
