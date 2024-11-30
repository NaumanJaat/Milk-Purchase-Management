import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import database from "../firebase";

const UserDetails = () => {
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const fetchDetails = () => {
    const userRef = ref(database, `users/${userId}`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserDetails(snapshot.val());
      } else {
        alert("User not found!");
      }
    });
  };

  const totalMilk = userDetails?.entries
    ? Object.values(userDetails.entries).reduce((sum, entry) => sum + entry.quantity, 0)
    : 0;
    

  return (
    <div>
      <h2>User Details</h2>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchDetails}>Fetch Details</button>
      {userDetails && (
        <div>
          <h3>{userDetails.name}</h3>
          <p>Total Milk: {totalMilk} liters</p>
          <p>Total Cost: {totalMilk * userDetails.pricePerLiter} PKR</p>
          <h4>Milk Entries</h4>
          <ul>
            {Object.values(userDetails.entries || {}).map((entry, index) => (
              <li key={index}>
                {entry.date}: {entry.quantity} liters
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
