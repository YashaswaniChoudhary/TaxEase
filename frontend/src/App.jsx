import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [income, setIncome] = useState('');
    const [tax, setTax] = useState('');

    const calculateTax = async () => {
        try {
            const response = await axios.post('http://localhost:5000/calculate', { income });
            setTax(response.data.tax);
        } catch (error) {
            console.error('Error calculating tax:', error);
        }
    };

    return (
        <div className="App">
            <h1>TaxEase</h1>
            <input
                type="number"
                placeholder="Enter your income"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
            />
            <button onClick={calculateTax}>Calculate Tax</button>
            {tax && <h2>Your estimated tax is: {tax}</h2>}
        </div>
    );
};

export default App;

