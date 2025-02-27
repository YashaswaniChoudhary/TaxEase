import { createTheme } from "@mui/material/styles";

const theme = (mode) =>
  createTheme({
    palette: {
      mode: mode, // Uses "light" or "dark"
      primary: { main: "#1976d2" },
      secondary: { main: "#ff4081" },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f5f5",
        paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      h1: { fontSize: "2rem", fontWeight: 600 },
      h2: { fontSize: "1.5rem", fontWeight: 500 },
    },
  });

export default theme;