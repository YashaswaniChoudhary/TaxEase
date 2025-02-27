import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import theme from "./theme"; // Ensure theme.js is correctly configured

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme("light")}> {/* Default theme */}
      <CssBaseline /> {/* Ensures proper global styling */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);