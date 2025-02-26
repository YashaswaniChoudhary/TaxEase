import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

const Main = () => {
  const [mode, setMode] = useState("light");

  return (
    <ThemeProvider theme={theme(mode)}>
      <CssBaseline /> {/* Ensures consistent background & typography */}
      <App mode={mode} setMode={setMode} />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
