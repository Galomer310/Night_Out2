import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  beerPrice: 0,
  shotPrice: 0,
  foodPrice: 0,
  tipAmount: 0,
  participants: 1,
};

const foodDrinkSlice = createSlice({
  name: "foodDrink",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { id, type } = action.payload;
      const price =
        type === "beer"
          ? state.beerPrice
          : type === "shot"
          ? state.shotPrice
          : type === "food"
          ? state.foodPrice
          : 0;

      // Check if item already exists in the list, if so, increase quantity
      const existingItem = state.items.find((item) => item.name === type);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id, name: type, price, quantity: 1 });
      }
    },
    subtractItem: (state, action) => {
      const { id, type } = action.payload;
      const existingItem = state.items.find((item) => item.name === type);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      }
    },
    deleteItem: (state, action) => {
      const { id } = action.payload;
      state.items = state.items.filter((item) => item.name !== id);
    },
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
    clearItems: (state) => {
      state.items = [];
    },
  },
});

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

export default foodDrinkSlice.reducer;
