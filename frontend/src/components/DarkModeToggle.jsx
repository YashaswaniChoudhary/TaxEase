import React from "react";
import { FormControlLabel, Switch } from "@mui/material";

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode((prev) => !prev)}
        />
      }
      label="Dark Mode"
    />
  );
};

export default DarkModeToggle;