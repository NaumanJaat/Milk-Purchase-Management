import React, { useState, useEffect } from "react";
import { ref, update, onValue, get } from "firebase/database";
import database from "../firebase";
import "./UpdateEntry.css"; // Add component-specific styles

const UpdateEntry = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [entryKey, setEntryKey] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [entries, setEntries] = useState(null);

  // Fetch user name and entries from Firebase when userId changes
  useEffect(() => {
    if (userId) {
      const userRef = ref(database, `users/${userId}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserName(userData.name);
          setEntries(userData.entries || {});
        } else {
          
          setEntries(null);
        }
      });
    }
  }, [userId]);

  const fetchEntries = () => {
    if (userId) {
      const entriesRef = ref(database, `users/${userId}/entries`);
      onValue(entriesRef, (snapshot) => {
        if (snapshot.exists()) {
          setEntries(snapshot.val());
        } else {
          alert("No entries found for this user!");
        }
      });
    }
  };

  const updateEntryHandler = () => {
    if (!entryKey || !newDate || !newQuantity) {
      alert("Please fill out all fields!");
      return;
    }

    const entryRef = ref(database, `users/${userId}/entries/${entryKey}`);
    update(entryRef, { date: newDate, quantity: parseFloat(newQuantity) })
      .then(() => {
        alert("Entry updated successfully!");
        setEntryKey("");
        setNewDate("");
        setNewQuantity("");
        fetchEntries();
      })
      .catch((error) => alert("Failed to update entry: " + error.message));
  };

  return (
    <div className="update-entry">
      <h2>Update Milk Entry</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchEntries}>Fetch Entries</button>
      {userName && <h4>User: {userName}</h4>}
      {entries && (
        <div>
          <h4>Select Entry to Update</h4>
          <ul className="entry-list">
            {Object.entries(entries).map(([key, entry]) => (
              <li key={key} className="entry-item">
                {entry.date}: {entry.quantity} liters
                <button onClick={() => setEntryKey(key)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {entryKey && (
        <div className="entry-form">
          <h4>Update Entry</h4>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <input
            type="number"
            placeholder="New Quantity"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <button onClick={updateEntryHandler}>Update Entry</button>
        </div>
      )}
    </div>
  );
};

export default UpdateEntry;
