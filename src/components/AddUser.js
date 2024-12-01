import React, { useState, useEffect } from "react";
import database from "../firebase"; // Update the path to your Firebase configuration
import { ref, set, get, remove, onValue } from "firebase/database";

const AddUser = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [actionPassword, setActionPassword] = useState("");
  const [message, setMessage] = useState("");
  const [actionName, setActionName] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users and listen for changes
  useEffect(() => {
    const usersRef = ref(database, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userList = Object.keys(data).map((key) => ({
          name: key,
          ...data[key],
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Function to add a user
  const addUserHandler = () => {
    if (!name || !password) {
      setMessage("Please fill all fields for adding a user.");
      return;
    }

    const userRef = ref(database, `users/${name}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setMessage("User already exists.");
      } else {
        set(userRef, { password })
          .then(() => {
            setMessage(`User ${name} added successfully!`);
            setName("");
            setPassword("");
          })
          .catch((error) => {
            setMessage(`Error adding user: ${error.message}`);
          });
      }
    });
  };

  // Function to remove a user
  const removeUserHandler = () => {
    if (!actionName || !actionPassword) {
      setMessage("Please enter the name and password for removing a user.");
      return;
    }

    const userRef = ref(database, `users/${actionName}`);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.password === actionPassword) {
            remove(userRef)
              .then(() => {
                setMessage(`User ${actionName} removed successfully!`);
                setActionName("");
                setActionPassword("");
              })
              .catch((error) => {
                setMessage(`Error removing user: ${error.message}`);
              });
          } else {
            setMessage("Incorrect password. User not removed.");
          }
        } else {
          setMessage("User not found.");
        }
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  return (
    <div>
      <h2>User Management</h2>

      {/* Add User Section */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Add User</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={addUserHandler}>Add User</button>
      </div>

      {/* Remove User Section */}
      <div>
        <h3>Remove User</h3>
        <input
          type="text"
          placeholder="Name"
          value={actionName}
          onChange={(e) => setActionName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={actionPassword}
          onChange={(e) => setActionPassword(e.target.value)}
        />
        <button onClick={removeUserHandler}>Remove User</button>
      </div>

      {/* User List */}
      <div style={{ marginTop: "20px" }}>
        <h3>User List</h3>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.name}>
                <strong>{user.name}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      {/* Message Display */}
      <p style={{ marginTop: "20px", color: "blue" }}>{message}</p>
    </div>
  );
};

export default AddUser;
