import React, { useState, useEffect } from "react";
import  database  from "../firebase"; // Adjust the path if necessary
import { ref, get, push } from "firebase/database";

const AddMilkEntry = () => {
  const [userName, setUserName] = useState("");
  const [milkAmount, setMilkAmount] = useState("");
  const [date, setDate] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch users from Firebase
  useEffect(() => {
    const usersRef = ref(database, "users");
    get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = Object.keys(snapshot.val());
        setUsers(userData);
      } else {
        setUsers([]);
      }
    });
  }, []);

  // Function to add milk entry
  const addMilkEntryHandler = () => {
    if (!userName || !milkAmount || !date) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (users.length === 0) {
      setMessage("No users available. Please add a user first.");
      return;
    }

    if (!users.includes(userName)) {
      setMessage("User does not exist. Please check the name.");
      return;
    }

    const milkEntryRef = ref(database, `milkEntries/${userName}`);
    push(milkEntryRef, {
      date,
      amount: Number(milkAmount),
    })
      .then(() => {
        setMessage("Milk entry added successfully!");
        setUserName("");
        setMilkAmount("");
        setDate("");
      })
      .catch((error) => {
        setMessage(`Error adding milk entry: ${error.message}`);
      });
  };

  return (
    <div>
      <h2>Add Milk Entry</h2>
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Milk Amount (liters)"
        value={milkAmount}
        onChange={(e) => setMilkAmount(e.target.value)}
      />
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={addMilkEntryHandler}>Add Milk Entry</button>
      <p style={{ color: "blue", marginTop: "20px" }}>{message}</p>
    </div>
  );
};

export default AddMilkEntry;
