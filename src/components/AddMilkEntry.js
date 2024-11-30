import React, { useState } from "react";
import { ref, push } from "firebase/database";
import database from "../firebase";

const AddMilkEntry = () => {
  const [userId, setUserId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");

  const addEntryHandler = () => {
    push(ref(database, `users/${userId}/entries`), {
      date,
      quantity: parseFloat(quantity),
    }).then(() => {
      alert("Milk entry added successfully!");
      setUserId("");
      setQuantity("");
      setDate("");
    });
  };

  return (
    <div>
      <h2>Add Milk Entry</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity (liters)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={addEntryHandler}>Add Entry</button>
    </div>
  );
};

export default AddMilkEntry;
