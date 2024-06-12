import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Example } from '../../app/types';
import { RootState } from '../../app/store';

const initialState: Example = {
  example: 'this is a string',
};

const ExampleSlice = createSlice({
  name: 'Example',
  initialState,
  reducers: {
    exampleStateSetter(state, action: PayloadAction<string>) {
      state.example = action.payload;
    },
  },
});

export const { exampleStateSetter } = ExampleSlice.actions;
export const selectExampleState = (state: RootState) => state.example.example;
export default ExampleSlice.reducer;
