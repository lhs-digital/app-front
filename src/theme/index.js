import { createTheme } from "@mui/material";

const lightPalette = {
  mode: "light",
  primary: {
    main: "#000000",
    light: "#DFDFEB",
    dark: "#2B2B30",
    contrastText: "#fff",
  },
  secondary: {
    main: "#5462B6",
    light: "#9BA4D4",
    dark: "#3D498F",
    contrastText: "#fff",
  },
  info: {
    main: "#6B7280",
    light: "#8898AA",
    dark: "#44515F",
    contrastText: "#FFF",
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#fff",
    light: "#2B2B30",
    dark: "#DFDFEB",
    contrastText: "#000",
  },
  secondary: {
    main: "#5462B6",
    light: "#9BA4D4",
    dark: "#3D498F",
    contrastText: "#fff",
  },
  info: {
    main: "#6B7280",
    light: "#8898AA",
    dark: "#44515F",
    contrastText: "#FFF",
  },
};

const handleMode = (mode) => {
  if (mode === "system") {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDarkMode ? "dark" : "light";
  }
  return mode;
};

export const getTheme = (mode) => {
  createTheme({
    colorSchemes: {
      light: lightPalette,
      dark: darkPalette,
    },
    palette:
      handleMode(mode || "system") === "dark" ? darkPalette : lightPalette,
    typography: {
      fontFamily: "Onest",
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          size: "large",
        },
        styleOverrides: {
          root: {
            borderRadius: "0.5rem",
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            borderRadius: "1rem",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "0.75rem",
            overflow: "clip",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: "0.5rem",
            overflow: "clip",
          },
        },
      },
    },
  });
};

export const baseTheme = createTheme({
  palette: lightPalette,
  typography: {
    fontFamily: "Onest",
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: "large",
      },
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderColor: "#e5e7eb",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          borderColor: "#e5e7eb",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          overflow: "clip",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          overflow: "clip",
        },
      },
    },
  },
});
