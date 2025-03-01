// Import the createSlice helper from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state for the food and drink calculator
const initialState = {
  items: [], // Array to hold added items (beer, shot, food)
  beerPrice: 0, // Price for beer
  shotPrice: 0, // Price for shot
  foodPrice: 0, // Total price for food
  tipAmount: 0, // Tip percentage
  participants: 1, // Number of people sharing the food cost
};

// Create a slice named "foodDrink" with initial state and reducers
const foodDrinkSlice = createSlice({
  name: "foodDrink", // Slice name
  initialState, // Starting state for this slice
  reducers: {
    // Reducer to add an item (beer, shot, or food)
    addItem: (state, action) => {
      // Destructure id and type from the action payload
      const { id, type } = action.payload;
      // Determine the price based on the item type
      const price =
        type === "beer"
          ? state.beerPrice
          : type === "shot"
          ? state.shotPrice
          : type === "food"
          ? state.foodPrice
          : 0;

      // Check if the item already exists; if so, increase its quantity
      const existingItem = state.items.find((item) => item.name === type);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // Otherwise, push a new item object with quantity 1
        state.items.push({ id, name: type, price, quantity: 1 });
      }
    },
    // Reducer to subtract (decrease quantity) an item
    subtractItem: (state, action) => {
      const { id, type } = action.payload;
      const existingItem = state.items.find((item) => item.name === type);
      // Decrease the quantity only if it's greater than 1
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      }
    },
    // Reducer to completely remove an item from the list
    deleteItem: (state, action) => {
      const { id } = action.payload;
      state.items = state.items.filter((item) => item.name !== id);
    },
    // Reducers to set the prices and values
    setBeerPrice: (state, action) => {
      state.beerPrice = action.payload;
    },
    setShotPrice: (state, action) => {
      state.shotPrice = action.payload;
    },
    setFoodPrice: (state, action) => {
      state.foodPrice = action.payload;
    },
    setTipAmount: (state, action) => {
      state.tipAmount = action.payload;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    // Reducer to clear all items (used for restarting the calculation)
    clearItems: (state) => {
      state.items = [];
    },
  },
});

// Export the action creators for use in components
export const {
  addItem,
  subtractItem,
  deleteItem,
  setBeerPrice,
  setShotPrice,
  setFoodPrice,
  setTipAmount,
  setParticipants,
  clearItems,
} = foodDrinkSlice.actions;

// Export the reducer to be used when configuring the store
export default foodDrinkSlice.reducer;
