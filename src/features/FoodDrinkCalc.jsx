// Import necessary hooks from react-redux and React
import { useSelector, useDispatch } from "react-redux";
// Import all the action creators from our foodDrink slice
import {
  addItem,
  subtractItem,
  setBeerPrice,
  setShotPrice,
  setFoodPrice,
  setTipAmount,
  setParticipants,
  deleteItem,
  clearItems,
} from "./state/slice";
import { useState } from "react";

// Define the FoodDrinkCalc functional component
function FoodDrinkCalc() {
  // Get the dispatch function to dispatch actions to Redux store
  const dispatch = useDispatch();
  // Get state values from the Redux store using useSelector
  const items = useSelector((state) => state.foodDrink.items);
  const beerPrice = useSelector((state) => state.foodDrink.beerPrice);
  const shotPrice = useSelector((state) => state.foodDrink.shotPrice);
  const foodPrice = useSelector((state) => state.foodDrink.foodPrice);
  const tipAmount = useSelector((state) => state.foodDrink.tipAmount);
  const participants = useSelector((state) => state.foodDrink.participants);

  // Local state to track button and header color (used for dynamic styling)
  const [buttonColor, setButtonColor] = useState("#20b2aa"); // Default button color
  const [headerColor, setHeaderColor] = useState("#20b2aa");   // Default header color

  // Define a cycle of colors to be used (not used now, but kept for possible future enhancement)
  const colorCycle = ["#ff6347", "#4682b4", "#800080", "#808080"]; // red, blue, purple, gray
  const [colorIndex, setColorIndex] = useState(0); // Track the current color index

  // Function to dispatch an action to add an item (beer, shot, or food)
  const handleAddItem = (id, type) => {
    dispatch(addItem({ id, type }));
  };

  // Function to dispatch an action to subtract an item quantity
  const handleSubtractItem = (id, type) => {
    dispatch(subtractItem({ id, type }));
  };

  // Function to dispatch an action to delete an item completely
  const handleDeleteItem = (id) => {
    dispatch(deleteItem({ id }));
  };

  // Handler to update the beer price from user input
  const handleBeerPriceChange = (event) => {
    dispatch(setBeerPrice(parseFloat(event.target.value) || 0));
  };

  // Handler to update the shot price from user input
  const handleShotPriceChange = (event) => {
    dispatch(setShotPrice(parseFloat(event.target.value) || 0));
  };

  // Handler to update the food price from user input
  const handleFoodPriceChange = (event) => {
    dispatch(setFoodPrice(parseFloat(event.target.value) || 0));
  };

  // Handler to update the tip percentage from user input
  const handleTipAmountChange = (event) => {
    dispatch(setTipAmount(parseFloat(event.target.value) || 0));
  };

  // Handler to update the number of participants from user input
  const handleParticipantsChange = (event) => {
    dispatch(setParticipants(parseInt(event.target.value) || 1));
  };

  // Function to calculate the total amount based on items, food price, tip and participants
  const calculateTotal = () => {
    // Sum up the total for all items (price multiplied by quantity)
    const totalItems = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    // Calculate the share of food price per participant
    const foodPortion = foodPrice / participants;
    // Calculate the total before tip
    const totalAmountBeforeTip = totalItems + foodPortion;
    // Calculate the tip amount in dollars
    const totalTip = (tipAmount / 100) * totalAmountBeforeTip;
    // Return the final total amount including tip
    return totalAmountBeforeTip + totalTip;
  };

  // Find the beer and shot items to display current quantity (if any)
  const beerItem = items.find((item) => item.name === "beer");
  const shotItem = items.find((item) => item.name === "shot");

  // Modified Next Calc handler: simply reloads the page to "restart" the calculation
  const handleNextCalc = () => {
    // Reload the entire page which resets all states
    window.location.reload();
  };

  // Determine the current dynamic colors (if you want to add color cycling later)
  const currentButtonColor = colorCycle[colorIndex];
  const currentHeaderColor = colorCycle[colorIndex];

  return (
    <div>
      {/* Header with dynamic color */}
      <h2 style={{ color: currentHeaderColor }}>Food and Drink Calculator</h2>

      {/* Beer Input Section */}
      <div>
        <label>Beer Price: </label>
        <input
          type="number"
          value={beerPrice}
          onChange={handleBeerPriceChange}
          placeholder="Enter price for one beer"
        />
        <button onClick={() => handleAddItem("beer", "beer")}>
          Add One Beer {beerItem ? `(${beerItem.quantity})` : "(0)"}
        </button>
        <button onClick={() => handleDeleteItem("beer")}>Delete Beer</button>
      </div>

      {/* Shot Input Section */}
      <div>
        <label>Shot Price: </label>
        <input
          type="number"
          value={shotPrice}
          onChange={handleShotPriceChange}
          placeholder="Enter price for one shot"
        />
        <button onClick={() => handleAddItem("shot", "shot")}>
          Add One Shot {shotItem ? `(${shotItem.quantity})` : "(0)"}
        </button>
        <button onClick={() => handleDeleteItem("shot")}>Delete Shot</button>
      </div>

      {/* Food Input Section */}
      <div>
        <label>Food Price: </label>
        <input
          type="number"
          value={foodPrice}
          onChange={handleFoodPriceChange}
          placeholder="Enter total food price"
        />
        <button onClick={() => handleAddItem("food", "food")}>Add Food</button>
        <button onClick={() => handleDeleteItem("food")}>Delete Food</button>
      </div>

      {/* Participants Input: Used for splitting the food cost */}
      <div>
        <label>Number of Participants (for Food): </label>
        <input
          type="number"
          value={participants}
          onChange={handleParticipantsChange}
          min="1"
        />
      </div>

      {/* Tip Input Section */}
      <div>
        <label>Tip Amount (percentage): </label>
        <input
          type="number"
          value={tipAmount}
          onChange={handleTipAmountChange}
          placeholder="Enter tip percentage"
        />
        <button onClick={() => handleDeleteItem("tip")}>Delete Tip</button>
      </div>

      {/* Total Calculation Display */}
      <div>
        <h3>Total: ${calculateTotal()}</h3>
      </div>

      {/* Next Calc button: When clicked, page reloads to restart the calculation */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: currentButtonColor,
        }}
        onClick={handleNextCalc}
      >
        Next Calc
      </button>
    </div>
  );
}

// Export the component as default
export default FoodDrinkCalc;
