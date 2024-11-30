import React from "react";
import "./MilkEntryList.css"; // Add a CSS file for component-specific styles

const MilkEntryList = ({ entries, pricePerLiter }) => {
  if (!entries || Object.keys(entries).length === 0) {
    return <p className="no-entries">No milk entries available.</p>;
  }

  let totalCost = 0;

  // Calculate the total cost based on the quantity and price
  Object.entries(entries).forEach(([key, entry]) => {
    const quantity = parseFloat(entry.quantity);
    if (!isNaN(quantity)) {
      totalCost += quantity * pricePerLiter;
    }
  });

  return (
    <div className="entry-list">
      <h4>Milk Entries</h4>
      <ul>
        {Object.entries(entries).map(([key, entry]) => (
          <li key={key} className="entry-item">
            <span className="entry-date">{entry.date}</span>
            <span className="entry-quantity">{entry.quantity} liters</span>
          </li>
        ))}
      </ul>
      <div className="total-cost">
        <h5>Total Cost: {totalCost.toFixed(2)} PKR</h5>
      </div>
    </div>
  );
};

export default MilkEntryList;
