import { createSlice } from "@reduxjs/toolkit";

export interface ConterState {
  data: number;
  title: string;
}

const initialState: ConterState = {
  data: 42,
  title: "YARC (yet another redux counter)",
};

export const counterSlice = createSlice({
  name: "counter",
  initialState: initialState,
  reducers: {
    increment: (state, action) => {
      state.data += action.payload;
    },
    decrement: (state, action) => {
      state.data -= action.payload;
    },
  },
});

// this is not necessary. It's just for easy to use.
export const { increment, decrement } = counterSlice.actions;
