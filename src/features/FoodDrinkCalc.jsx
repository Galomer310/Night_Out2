import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  subtractItem,
  deleteItem,
  clearItems,
  setBeerPrice,
  setShotPrice,
  setFoodPrice,
  setTipAmount,
  setParticipants,
} from "./state/slice";

// We'll store an array of "bill" objects in sessionStorage under this key
const BILLS_STORAGE_KEY = "bills";

function FoodDrinkCalc() {
  const dispatch = useDispatch();

  // Redux state
  const items = useSelector((state) => state.foodDrink.items);
  const beerPrice = useSelector((state) => state.foodDrink.beerPrice);
  const shotPrice = useSelector((state) => state.foodDrink.shotPrice);
  const foodPrice = useSelector((state) => state.foodDrink.foodPrice);
  const tipAmount = useSelector((state) => state.foodDrink.tipAmount);
  const participants = useSelector((state) => state.foodDrink.participants);

  // Local component states
  const [userName, setUserName] = useState("");

  // "bills" will hold a list of all finalized bills (with name, total, etc.)
  const [bills, setBills] = useState([]);

  // On component mount, load any existing bills from sessionStorage
  useEffect(() => {
    const storedBills = sessionStorage.getItem(BILLS_STORAGE_KEY);
    if (storedBills) {
      setBills(JSON.parse(storedBills));
    }
  }, []);

  // Save bills to sessionStorage whenever "bills" changes
  useEffect(() => {
    sessionStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(bills));
  }, [bills]);

  // Calculate the total for the current bill
  const calculateTotal = () => {
    const totalItems = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const foodPortion = foodPrice / participants;
    const totalBeforeTip = totalItems + foodPortion;
    const tipInDollars = (tipAmount / 100) * totalBeforeTip;
    return totalBeforeTip + tipInDollars;
  };

  // Add an item (beer, shot, food)
  const handleAddItem = (id, type) => {
    dispatch(addItem({ id, type }));
  };

  // Subtract an item quantity
  const handleSubtractItem = (id, type) => {
    dispatch(subtractItem({ id, type }));
  };

  // Remove an item
  const handleDeleteItem = (id) => {
    dispatch(deleteItem({ id }));
  };

  // onChange handlers
  const handleBeerPriceChange = (e) => {
    dispatch(setBeerPrice(parseFloat(e.target.value) || 0));
  };
  const handleShotPriceChange = (e) => {
    dispatch(setShotPrice(parseFloat(e.target.value) || 0));
  };
  const handleFoodPriceChange = (e) => {
    dispatch(setFoodPrice(parseFloat(e.target.value) || 0));
  };
  const handleTipAmountChange = (e) => {
    dispatch(setTipAmount(parseInt(e.target.value) || 0));
  };
  const handleParticipantsChange = (e) => {
    dispatch(setParticipants(parseInt(e.target.value) || 1));
  };

  // "Reset" button to clear the current form without saving a new bill
  const handleReset = () => {
    dispatch(clearItems());
    dispatch(setBeerPrice(0));
    dispatch(setShotPrice(0));
    dispatch(setFoodPrice(0));
    dispatch(setTipAmount(0));
    dispatch(setParticipants(1));
    setUserName("");
  };

  // "Next Calc" button:
  // 1) finalize the current bill
  // 2) store it in bills array
  // 3) reset the form
  const handleNextCalc = () => {
    const newBill = {
      userName: userName.trim() || "Anonymous",
      total: calculateTotal().toFixed(2),
      date: new Date().toLocaleString(),
      items: items.map((i) => ({ ...i })),
    };
    setBills((prev) => [...prev, newBill]);
    handleReset();
  };

  // Delete all bills from sessionStorage & state
  const handleDeleteAllBills = () => {
    sessionStorage.removeItem(BILLS_STORAGE_KEY);
    setBills([]);
  };

  // For item display in UI
  const beerItem = items.find((item) => item.name === "beer");
  const shotItem = items.find((item) => item.name === "shot");

  return (
    <div className="container">
      {/* HERO / SUMMARY SECTION */}
      <div className="hero-summary">
        <h2>Previous Bills</h2>
        {bills.length === 0 ? (
          <p>No bills saved yet.</p>
        ) : (
          <div className="bills-container">
            {bills.map((bill, index) => (
              <div key={index} className="bill-block">
                <h4 className="bill-heading">
                  {bill.userName} &nbsp; (Total: ${bill.total})
                </h4>
                <small>{bill.date}</small>
                <ul>
                  {bill.items.map((it, iIndex) => (
                    <li key={iIndex}>
                      {it.quantity} x {it.name} @ ${it.price}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={handleDeleteAllBills}>Delete All Data</button>
          </div>
        )}
      </div>

      {/* CURRENT CALC SECTION */}
      <h2>Food and Drink Calculator</h2>

      {/* User Name */}
      <div className="input-group">
        <label htmlFor="userName">Your Name:</label>
        <input
          id="userName"
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      {/* Beer Inputs */}
      <div className="input-group">
        <label>Beer Price:</label>
        <input
          type="number"
          value={beerPrice}
          onChange={handleBeerPriceChange}
          min="0"
          step="0.01"
          placeholder="Price for one beer"
        />
        <div className="button-group">
          <button onClick={() => handleAddItem("beer", "beer")}>
            Add Beer {beerItem ? `(${beerItem.quantity})` : ""}
          </button>
          {beerItem && beerItem.quantity > 0 && (
            <button onClick={() => handleSubtractItem("beer", "beer")}>
              Subtract
            </button>
          )}
          <button onClick={() => handleDeleteItem("beer")}>Delete Beer</button>
        </div>
      </div>

      {/* Shot Inputs */}
      <div className="input-group">
        <label>Shot Price:</label>
        <input
          type="number"
          value={shotPrice}
          onChange={handleShotPriceChange}
          min="0"
          step="0.01"
          placeholder="Price for one shot"
        />
        <div className="button-group">
          <button onClick={() => handleAddItem("shot", "shot")}>
            Add Shot {shotItem ? `(${shotItem.quantity})` : ""}
          </button>
          {shotItem && shotItem.quantity > 0 && (
            <button onClick={() => handleSubtractItem("shot", "shot")}>
              Subtract
            </button>
          )}
          <button onClick={() => handleDeleteItem("shot")}>Delete Shot</button>
        </div>
      </div>

      {/* Food Inputs */}
      <div className="input-group">
        <label>Food Price (total):</label>
        <input
          type="number"
          value={foodPrice}
          onChange={handleFoodPriceChange}
          min="0"
          step="0.01"
          placeholder="Enter total food price"
        />
        <div className="button-group">
          <button onClick={() => handleAddItem("food", "food")}>
            Add Food
          </button>
          <button onClick={() => handleDeleteItem("food")}>Delete Food</button>
        </div>
      </div>

      {/* Participants */}
      <div className="input-group">
        <label>Number of Participants (for Food):</label>
        <input
          type="number"
          value={participants}
          onChange={handleParticipantsChange}
          min="1"
        />
      </div>

      {/* Tip */}
      <div className="input-group">
        <label>Tip Amount (%):</label>
        <input
          type="number"
          value={tipAmount}
          onChange={handleTipAmountChange}
          min="0"
          step="0.01"
          placeholder="Enter tip percentage"
        />
      </div>

      {/* Display Current Bill Total */}
      <div className="total">
        Current Bill Total: ${calculateTotal().toFixed(2)}
      </div>

      {/* Button Row */}
      <div className="button-container">
        <button onClick={handleNextCalc}>Next Calc</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default FoodDrinkCalc;
