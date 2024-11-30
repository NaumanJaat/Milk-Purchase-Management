import React, { useState, useEffect } from "react";
import { ref, set, remove, onValue, get } from "firebase/database";
import database from "../firebase"; // Your Firebase configuration

const AddUser = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(""); // For displaying messages
  const [isSuccess, setIsSuccess] = useState(false); // To control success/error styling

  // Fetch users from Firebase on component mount
  useEffect(() => {
    const usersRef = ref(database, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUsers(usersArray);
      }
    });
  }, []);

  // Handle adding a new user
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert pricePerLiter to a number
    const price = parseFloat(pricePerLiter);
    
    // Validate the input
    if (isNaN(price)) {
      setMessage("Please enter a valid price.");
      setIsSuccess(false);
      return;
    }

    // Check if the user already exists in Firebase
    const userRef = ref(database, `users/${userId}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setMessage("Error: User already exists! Use other ID");
        setIsSuccess(false); // Set to error styling
      } else {
        // Store user data with the price
        set(userRef, {
          name: userName,
          pricePerLiter: price,  // Storing the price as a number
        })
        .then(() => {
          setMessage("User added successfully!");
          setIsSuccess(true); // Set to success styling
          setUserId("");
          setUserName("");
          setPricePerLiter("");
        })
        .catch((error) => {
          setMessage("Error adding user: " + error.message);
          setIsSuccess(false);
        });
      }
    });
  };

  // Handle removing a user
  const handleRemoveUser = (userId) => {
    const userRef = ref(database, `users/${userId}`);
    remove(userRef)
      .then(() => {
        setMessage("User removed successfully!");
        setIsSuccess(true);
      })
      .catch((error) => {
        setMessage("Error removing user: " + error.message);
        setIsSuccess(false);
      });
  };

  return (
    <div>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price per Liter"
          value={pricePerLiter}
          onChange={(e) => setPricePerLiter(e.target.value)}
          required
        />
        <button type="submit">Add User</button>
      </form>

      {/* Display message */}
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <h3>Existing Users</h3>
      <div>
        {users.length === 0 ? (
          <p>No users available.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="user-card">
              <p>{user.name}</p>
              <p>{user.id}</p>
              <p>Price per Liter: {user.pricePerLiter} PKR</p>
              <button onClick={() => handleRemoveUser(user.id)} className="remove-btn">Remove User</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddUser;
