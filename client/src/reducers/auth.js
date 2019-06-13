// this is the reducer for any authorization actions in our application

// reducers define the initial global state for that part of the app

// the initial auth state: essentially all the vars sufficient for any authorization activities
const initialAuthState = {
  isAuthorized: false,
  user: {} // initially, no user has logged in
};

// the reducer is just a function that takes an action and reduces the current state
// to the next state based on that action
export default function(state = initialAuthState, action) {
  switch (action.type) {
    default:
      // the default case is that we return the state as is, an identity reduction
      return state;
  }
}
