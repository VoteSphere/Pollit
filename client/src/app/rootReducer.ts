import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  // reducers go here
  // ex: auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;