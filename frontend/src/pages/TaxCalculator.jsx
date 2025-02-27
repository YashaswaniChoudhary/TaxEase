import { useState } from "react";

const TaxCalculator = () => {
  const [income, setIncome] = useState("");
  const [tax, setTax] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    setError(""); // Clear any previous error
    setTax(null); // Reset tax

    const numericIncome = parseFloat(income); // Convert input to a number
    if (isNaN(numericIncome) || numericIncome <= 0) {
      setError("Please enter a valid income amount.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tax/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income: numericIncome }), // Ensure it's a valid number
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error calculating tax.");
      }

      // Ensure we're using the correct field from the response
      setTax(data.tax || data.totalTax || "N/A");
    } catch (err) {
      setError(err.message || "Server error. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Tax Calculator</h2>
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        placeholder="Enter your income"
      />
      <button onClick={handleCalculate}>Calculate Tax</button>

      {tax !== null && <p>Your Tax Payable: ₹{tax}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TaxCalculator;