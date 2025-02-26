import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import DarkModeToggle from "./components/DarkModeToggle";
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const App = () => {
  const [income, setIncome] = useState("");
  const [tax, setTax] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false); // 🔥 Add dark mode state

  const calculateTax = async () => {
    setError("");
    setTax(null);
    try {
      const response = await axios.post("http://localhost:5000/api/tax/calculate", { income });
      setTax(response.data.tax);
    } catch (err) {
      setError("Error calculating tax. Please try again.");
    }
  };

  // 🔥 Dynamic theme based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 🔥 Ensures dark mode applies to the whole app */}
      <Container>
        <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
          {/* 🔥 Pass darkMode and setDarkMode as props */}
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

          <Typography variant="h1">Welcome to TaxEase</Typography>

          <TextField
            label="Enter Your Income"
            variant="outlined"
            fullWidth
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            sx={{ marginY: 2 }}
          />

          <Button variant="contained" color="primary" onClick={calculateTax}>
            Calculate Tax
          </Button>

          {tax !== null && (
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Tax Payable: ₹{tax}
            </Typography>
          )}

          {error && (
            <Typography color="error" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;