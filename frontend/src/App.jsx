// import { useState } from "react";
// import { Container, Paper, Typography, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
// import axios from "axios";

// const App = () => {
//   const [income, setIncome] = useState("");
//   const [investments80C, setInvestments80C] = useState("");
//   const [rentPaid, setRentPaid] = useState("");
//   const [basicSalary, setBasicSalary] = useState("");
//   const [cityType, setCityType] = useState("non-metro");
//   const [taxData, setTaxData] = useState(null);
//   const [error, setError] = useState("");

//   const handleCalculateTax = async () => {
//     setError(""); 
//     setTaxData(null); 

//     if (!income || isNaN(income) || income < 0) {
//       setError("Please enter a valid income.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:5000/api/tax/calculate", {
//         income: Number(income),
//         investments80C: Number(investments80C),
//         rentPaid: Number(rentPaid),
//         basicSalary: Number(basicSalary),
//         cityType
//       });

//       setTaxData(response.data);
//     } catch (err) {
//       setError("Error calculating tax. Please try again.");
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
//         <Typography variant="h4" gutterBottom>TaxEase - Smart Tax Assistant</Typography>

//         {/* Income Input */}
//         <TextField
//           fullWidth
//           label="Annual Income (₹)"
//           type="number"
//           value={income}
//           onChange={(e) => setIncome(e.target.value)}
//           margin="normal"
//         />

//         {/* Section 80C Investments */}
//         <TextField
//           fullWidth
//           label="Investments (80C) (₹)"
//           type="number"
//           value={investments80C}
//           onChange={(e) => setInvestments80C(e.target.value)}
//           margin="normal"
//         />

//         {/* Rent Paid Input */}
//         <TextField
//           fullWidth
//           label="Rent Paid (₹)"
//           type="number"
//           value={rentPaid}
//           onChange={(e) => setRentPaid(e.target.value)}
//           margin="normal"
//         />

//         {/* Basic Salary Input */}
//         <TextField
//           fullWidth
//           label="Basic Salary (₹)"
//           type="number"
//           value={basicSalary}
//           onChange={(e) => setBasicSalary(e.target.value)}
//           margin="normal"
//         />

//         {/* City Type Selection */}
//         <TextField
//           select
//           fullWidth
//           label="City Type"
//           value={cityType}
//           onChange={(e) => setCityType(e.target.value)}
//           margin="normal"
//         >
//           <MenuItem value="metro">Metro</MenuItem>
//           <MenuItem value="non-metro">Non-Metro</MenuItem>
//         </TextField>

//         {/* Calculate Button */}
//         <Button variant="contained" color="primary" onClick={handleCalculateTax} sx={{ marginTop: 2 }}>
//           Calculate Tax
//         </Button>

//         {/* Error Message */}
//         {error && <Typography color="error" sx={{ marginTop: 2 }}>{error}</Typography>}

//         {/* Tax Calculation Results */}
//         {taxData && (
//           <Paper sx={{ padding: 2, marginTop: 3 }}>
//             <Typography variant="h6">Total Tax: {taxData.totalTax}</Typography>
//             <Typography variant="body1">Rebate Applied: {taxData.rebateApplied}</Typography>
//             <Typography variant="body1">Taxable Income: {taxData.taxableIncome}</Typography>
//             <Typography variant="body1">Section 80C Deduction: {taxData.deductions.section80C}</Typography>
//             <Typography variant="body1">HRA Exemption: {taxData.deductions.hraExemption}</Typography>

//             {/* Tax Breakdown Table */}
//             <TableContainer sx={{ marginTop: 2 }}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell><b>Income Slab</b></TableCell>
//                     <TableCell><b>Tax Rate</b></TableCell>
//                     <TableCell><b>Tax Amount</b></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {taxData.taxBreakdown.map((item, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{item.slab}</TableCell>
//                       <TableCell>{item.rate}</TableCell>
//                       <TableCell>{item.tax}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         )}
//       </Paper>
//     </Container>
//   );
// };

// export default App;
import { useState } from "react";
import { Container,CssBaseline, Paper, Typography, Button, TextField, FormControlLabel, Switch, CircularProgress, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const App = () => {
  const [income, setIncome] = useState("");
  const [basicSalary, setBasicSalary] = useState("auto"); // Auto-calculated by default
  const [customBasic, setCustomBasic] = useState(false);
  const [investments80C, setInvestments80C] = useState("");
  const [rentPaid, setRentPaid] = useState("");
  const [cityType, setCityType] = useState("non-metro");
  const [tax, setTax] = useState(null);
  const [taxBreakdown, setTaxBreakdown] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleIncomeChange = (e) => {
    const value = e.target.value;
    setIncome(value);
    if (!customBasic) {
      setBasicSalary(value ? (0.4 * value).toFixed(2) : "");
    }
  };

  const calculateTax = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/tax/calculate", {
        income: Number(income),
        basicSalary: customBasic ? Number(basicSalary) : 0.4 * Number(income),
        investments80C: Number(investments80C),
        rentPaid: Number(rentPaid),
        cityType,
      });
      setTax(response.data.totalTax);
      setTaxBreakdown(response.data.taxBreakdown);
      setShowBreakdown(true);
    } catch (error) {
      console.error("Error calculating tax:", error);
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme(darkMode ? "dark" : "light")}>
     <CssBaseline /> 
    <Container maxWidth="md">
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
        label="Dark Mode"
      />
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4}}>
        <Typography variant="h4">TaxEase - Smart Tax Assistant</Typography>

        <TextField label="Annual Income (₹)" fullWidth margin="normal" value={income} onChange={handleIncomeChange} type="number"/>

        <TextField label="Investments (PPF, EPF, LIC, NSC - ₹ per year)" fullWidth margin="normal" value={investments80C} onChange={(e) => setInvestments80C(e.target.value)} type="number" />

        <TextField label="Rent Paid (₹ per month)" fullWidth margin="normal" value={rentPaid} onChange={(e) => setRentPaid(e.target.value)} type="number" />

        <Select fullWidth sx={{ mt: 2 }} margin="normal" value={cityType} onChange={(e) => setCityType(e.target.value)}>
          <MenuItem value="metro">Metro City</MenuItem>
          <MenuItem value="non-metro">Non-Metro City</MenuItem>
        </Select>

      <TextField
        label="Basic Salary (₹ per year)"
        fullWidth
        margin="normal"
        value={customBasic ? basicSalary : (0.4 * Number(income) || 0).toFixed(2)}
        onChange={(e) => setBasicSalary(e.target.value)}
        type="number"
        disabled={!customBasic} // Disable input unless customBasic is enabled
      />

      <FormControlLabel
        control={<Switch checked={customBasic} onChange={() => setCustomBasic(!customBasic)} />}
        label="Enter Custom Basic Salary"
      />
        <Button variant="contained" onClick={calculateTax} fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Calculate Tax"}
        </Button>

        {tax !== null && (
          <>
            <Typography variant="h6" sx={{ mt: 3 }}>Total Tax: ₹{tax}</Typography>
            <Button variant="outlined" onClick={() => setShowBreakdown(!showBreakdown)}>
              {showBreakdown ? "Hide Tax Breakdown" : "View Tax Breakdown"}
            </Button>
            {showBreakdown && taxBreakdown?.length > 0 && (
              <Paper sx={{ mt: 2, padding: 2 }}>
                <Typography variant="h6">Tax Breakdown:</Typography>
                {taxBreakdown.map((item, index) => (
                  <Typography key={index}>{item.slab}: {item.rate}, Tax: {item.tax}</Typography>
                ))}
              </Paper>
            )}
          </>
        )}
      </Paper>
    </Container>
    </ThemeProvider>
  );
};

export default App;