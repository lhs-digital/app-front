import { ThemeProvider } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { getTheme } from "../theme";

const ThemeModeContext = createContext();

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState("system");
  const root = document.getElementsByTagName("html")[0];
  useEffect(() => {
    if (mode === "dark") {
      root.classList.add("dark");
      document.body.setAttribute("data-theme", "dark");
    }
    if (mode === "light") {
      root.classList.remove("dark");
      document.body.setAttribute("data-theme", "light");
    }
    if (mode === "system") {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.remove(prefersDarkMode ? "dark" : "light");
      document.body.setAttribute(
        "data-theme",
        prefersDarkMode ? "dark" : "light",
      );
    }
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={getTheme(mode)}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeModeContext);
