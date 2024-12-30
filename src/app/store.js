import { configureStore } from "@reduxjs/toolkit";
import foodDrinkReducer from "../features/state/slice";

export const store = configureStore({
  reducer: {
    foodDrink: foodDrinkReducer,
  },
});
