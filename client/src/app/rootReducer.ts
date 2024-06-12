import { combineReducers } from '@reduxjs/toolkit';
// import exampleReducer from '../features/create-poll/createPollSlice';

const rootReducer = combineReducers({
  // reducers go here
  // example: exampleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
