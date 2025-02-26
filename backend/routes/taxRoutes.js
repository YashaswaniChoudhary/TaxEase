const express = require("express");
const router = express.Router();

const calculateTax = (income) => {
    const slabs = [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 0.05 },
        { limit: 900000, rate: 0.10 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 }
    ];

    let tax = 0;
    let previousLimit = 0;

    for (const slab of slabs) {
        if (income > slab.limit) {
            tax += (slab.limit - previousLimit) * slab.rate;
            previousLimit = slab.limit;
        } else {
            tax += (income - previousLimit) * slab.rate;
            break;
        }
    }

    const rebateAmount = 60000;
    tax = Math.max(tax - rebateAmount, 0);  // Ensures tax never goes negative

    return tax;
};

// API Endpoint: POST /api/tax/calculate
router.post("/calculate", (req, res) => {
    try {
        const { income } = req.body;

        if (!income || isNaN(income)) {
            return res.status(400).json({ message: "Invalid income amount" });
        }

        const taxAmount = calculateTax(income);
        res.json({ income, tax: taxAmount });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;