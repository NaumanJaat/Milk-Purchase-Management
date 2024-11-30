import React, { useState } from "react";
import { ref, push } from "firebase/database";
import database from "../firebase";
import "./MilkEntry.css";

const MilkEntry = () => {
  const [userId, setUserId] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");

  const addEntryHandler = () => {
    if (!userId || !date || !quantity) {
      alert("Please fill out all fields!");
      return;
    }

    const entryRef = ref(database, `users/${userId}/entries`);
    push(entryRef, { date, quantity: parseFloat(quantity) })
      .then(() => {
        alert("Milk entry added successfully!");
        setUserId("");
        setDate("");
        setQuantity("");
      })
      .catch((error) => alert("Failed to add entry: " + error.message));
  };

  return (
    <div className="milk-entry">
      <h2>Add Milk Entry</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity (liters)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={addEntryHandler}>Add Entry</button>
    </div>
  );
};

export default MilkEntry;
