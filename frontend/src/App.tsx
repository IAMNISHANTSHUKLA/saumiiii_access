import React from "react";
import { ThemeProvider, createTheme, ThemeOptions } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import "./App.css";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#FF69B4", // Hot Pink
    },
    secondary: {
      main: "#FFC0CB", // Light Pink
    },
    background: {
      default: "#FFF0F5", // Lavender Blush
    },
  },
};

const theme = createTheme(themeOptions);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Dashboard />
    </ThemeProvider>
  );
};

export default App;
