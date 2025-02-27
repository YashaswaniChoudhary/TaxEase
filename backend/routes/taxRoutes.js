const express = require("express");
const router = express.Router();

router.post("/calculate", (req, res) => {
    let { income, investments80C, rentPaid, basicSalary, cityType } = req.body;

    // Convert values to numbers
    income = Number(income) || 0;
    investments80C = Number(investments80C) || 0;
    rentPaid = Number(rentPaid) || 0;
    basicSalary = Number(basicSalary) || 0;

    if (income <= 0) {
        return res.status(400).json({ error: "Invalid income input" });
    }

    let taxableIncome = income;

    // Section 80C Deduction (Max ₹1,50,000)
    const max80CDeduction = 150000;
    const deduction80C = Math.min(investments80C, max80CDeduction);
    taxableIncome -= deduction80C;

    // HRA Exemption Calculation
    let hraExemption = 0;
    if (rentPaid > 0 && basicSalary > 0) {
        const rentMinus10PercentSalary = (rentPaid * 12) - (0.1 * basicSalary);
        const metroHRA = cityType === "metro" ? 0.5 * basicSalary : 0.4 * basicSalary;
        hraExemption = Math.max(0, Math.min(rentMinus10PercentSalary, metroHRA));
        taxableIncome -= hraExemption;
    }

    // Ensure taxable income is not negative
    taxableIncome = Math.max(0, taxableIncome);

    // Tax slabs as per the new tax regime
    const slabs = [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 0.05 },
        { limit: 900000, rate: 0.10 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 }
    ];

    let tax = 0;
    let taxBreakdown = [];
    let previousLimit = 0;

    slabs.forEach(slab => {
        if (taxableIncome > previousLimit) {
            let taxableAmount = Math.min(taxableIncome, slab.limit) - previousLimit;
            let slabTax = taxableAmount * slab.rate;
            tax += slabTax;

            taxBreakdown.push({
                slab: `₹${(previousLimit + 1).toLocaleString()} - ₹${slab.limit === Infinity ? '∞' : slab.limit.toLocaleString()}`,
                rate: `${(slab.rate * 100).toFixed(0)}%`,
                taxableAmount: `₹${taxableAmount.toLocaleString()}`,
                tax: `₹${slabTax.toFixed(2)}`
            });
            previousLimit = slab.limit;
        }
    });

    // Apply ₹60,000 rebate
    const rebateAmount = 60000;
    tax = Math.max(tax - rebateAmount, 0);

    res.json({
        income: `₹${income.toLocaleString()}`,
        totalTax: `₹${tax.toFixed(2)}`,
        rebateApplied: `₹${rebateAmount.toFixed(2)}`,
        deductions: {
            section80C: `₹${deduction80C.toLocaleString()}`,
            hraExemption: `₹${hraExemption.toLocaleString()}`
        },
        taxableIncome: `₹${taxableIncome.toLocaleString()}`,
        taxBreakdown
    });
});

module.exports = router;