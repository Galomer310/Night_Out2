import { useSelector, useDispatch } from "react-redux";
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

function FoodDrinkCalc() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.foodDrink.items);
  const beerPrice = useSelector((state) => state.foodDrink.beerPrice);
  const shotPrice = useSelector((state) => state.foodDrink.shotPrice);
  const foodPrice = useSelector((state) => state.foodDrink.foodPrice);
  const tipAmount = useSelector((state) => state.foodDrink.tipAmount);
  const participants = useSelector((state) => state.foodDrink.participants);

  // State to track button color and header color
  const [buttonColor, setButtonColor] = useState("#20b2aa"); // default color
  const [headerColor, setHeaderColor] = useState("#20b2aa"); // default color

  const colorCycle = ["#ff6347", "#4682b4", "#800080", "#808080"]; // red, blue, purple, gray
  const [colorIndex, setColorIndex] = useState(0); // To track current color in the cycle

  const handleAddItem = (id, type) => {
    dispatch(addItem({ id, type }));
  };

  const handleSubtractItem = (id, type) => {
    dispatch(subtractItem({ id, type }));
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItem({ id }));
  };

  const handleBeerPriceChange = (event) => {
    dispatch(setBeerPrice(parseFloat(event.target.value) || 0));
  };

  const handleShotPriceChange = (event) => {
    dispatch(setShotPrice(parseFloat(event.target.value) || 0));
  };

  const handleFoodPriceChange = (event) => {
    dispatch(setFoodPrice(parseFloat(event.target.value) || 0));
  };

  const handleTipAmountChange = (event) => {
    dispatch(setTipAmount(parseFloat(event.target.value) || 0));
  };

  const handleParticipantsChange = (event) => {
    dispatch(setParticipants(parseInt(event.target.value) || 1));
  };

  const calculateTotal = () => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const foodPortion = foodPrice / participants;
    const totalAmountBeforeTip = totalItems + foodPortion;
    const totalTip = (tipAmount / 100) * totalAmountBeforeTip;
    return totalAmountBeforeTip + totalTip;
  };

  const beerItem = items.find((item) => item.name === "beer");
  const shotItem = items.find((item) => item.name === "shot");

  const handleNextCalc = () => {
    const name = prompt("Enter your name for the calculation:");
    if (name) {
      const calcData = {
        name,
        items,
        beerPrice,
        shotPrice,
        foodPrice,
        tipAmount,
        participants,
        total: calculateTotal(),
      };
      localStorage.setItem(`calcData-${name}`, JSON.stringify(calcData));

      // Change color for both the header and Next Calc button
      setColorIndex((prevIndex) => (prevIndex + 1) % colorCycle.length); // Cycle through the color list

      // Clear the form for the new calculation
      dispatch(clearItems());
      dispatch(setBeerPrice(0));
      dispatch(setShotPrice(0));
      dispatch(setFoodPrice(0));
      dispatch(setTipAmount(0));
      dispatch(setParticipants(1));
    }
  };

  // Update the colors based on the current index in the cycle
  const currentButtonColor = colorCycle[colorIndex];
  const currentHeaderColor = colorCycle[colorIndex];

  return (
    <div>
      {/* Header with dynamic color */}
      <h2 style={{ color: currentHeaderColor }}>Food and Drink Calculator</h2>

      {/* Beer input */}
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

      {/* Shot input */}
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

      {/* Food input */}
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

      {/* Participants input (only for dividing food cost) */}
      <div>
        <label>Number of Participants (for Food): </label>
        <input
          type="number"
          value={participants}
          onChange={handleParticipantsChange}
          min="1"
        />
      </div>

      {/* Tip input */}
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

      {/* Total calculation */}
      <div>
        <h3>Total: ${calculateTotal()}</h3>
      </div>

      {/* Next Calc button with dynamic color change */}
      <button
        style={{ position: "fixed", bottom: "20px", right: "20px", backgroundColor: currentButtonColor }}
        onClick={handleNextCalc}
      >
        Next Calc
      </button>
    </div>
  );
}

export default FoodDrinkCalc;
