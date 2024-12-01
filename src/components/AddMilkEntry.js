import React, { useState } from "react";
import { ref, get, push } from "firebase/database";
import database from "../firebase";

const AddMilkEntry = () => {
  const [userId, setUserId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addEntryHandler = () => {
    const userRef = ref(database, `users/${userId}`);

    // Check if the user exists
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        // User exists, proceed with adding milk entry
        push(ref(database, `users/${userId}/entries`), {
          date,
          quantity: parseFloat(quantity),
        }).then(() => {
          alert("Milk entry added successfully!");
          setUserId("");
          setQuantity("");
          setDate("");
          setErrorMessage(""); // Clear error message if entry is successful
        });
      } else {
        // User does not exist, show an error message
        setErrorMessage("User not found! Please check the User ID.");
      }
    });
  };

  return (
    <div>
      <h2>Add Milk Entry</h2>
      <input
        type="text"
        placeholder="User Name"
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

      {/* Display error message if user is not found */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default AddMilkEntry;
