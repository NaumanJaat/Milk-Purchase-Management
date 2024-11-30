import React from "react";
import AddUser from "./components/AddUser";
import AddMilkEntry from "./components/AddMilkEntry";
import UserDetails from "./components/UserDetails";
import "./App.css";
import UpdateEntry from "./components/UpdateEntry";

function App() {
  return (
    <div className="App">
      <h1>Milk Purchase Management</h1>
      <AddUser />
      <AddMilkEntry />
      <UserDetails />
      <UpdateEntry />
    </div>
  );
}

export default App;
