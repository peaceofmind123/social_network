import { TEST_DISPATCH } from "./types";
// Contains actions that define the data required by the reducer to update state
// These just return constant objects which at least have a type and tell the reducer what to do
// The doing part is done by the reducer itself, not here

// Action to register the user
export const registerUser = userData => ({
  type: TEST_DISPATCH,
  payload: userData
});
