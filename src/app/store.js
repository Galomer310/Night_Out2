// Import the configureStore function from Redux Toolkit to create a Redux store
import { configureStore } from "@reduxjs/toolkit";
// Import the reducer for the foodDrink slice
import foodDrinkReducer from "../features/state/slice";

// Create and export the Redux store by configuring it with our foodDrink reducer
export const store = configureStore({
  reducer: {
    // The key "foodDrink" will be used in the state and holds the foodDrinkReducer
    foodDrink: foodDrinkReducer,
  },
});
