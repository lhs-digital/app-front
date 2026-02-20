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
    main: "#0a8feb",
    light: "#35abfb",
    dark: "#005aa4",
    contrastText: "#fff",
  },
  info: {
    main: "#7d7d7d",
    light: "#a8a8a8",
    dark: "#545454",
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
    main: "#0a8feb",
    light: "#35abfb",
    dark: "#005aa4",
    contrastText: "#fff",
  },
  info: {
    main: "#7d7d7d",
    light: "#a8a8a8",
    dark: "#545454",
    contrastText: "#FFF",
  },
};

export const handleMode = (mode) => {
  if (mode === "system") {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    return prefersDarkMode ? "dark" : "light";
  }

  return mode;
};

export const getTheme = (mode) => {
  return createTheme({
    palette:
      handleMode(mode || "system") === "dark" ? darkPalette : lightPalette,
    typography: {
      fontFamily: "Onest",
    },
    components: {
      MuiTooltip: {
        defaultProps: {
          arrow: true,
        },
        styleOverrides: {
          tooltip: {
            borderRadius: "0.75rem",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          size: "large",
        },
        styleOverrides: {
          root: {
            borderRadius: "0.75rem",
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            borderRadius: "0.75rem",
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.75rem",
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          variant: "outlined",
        },
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
            borderRadius: "0.75rem",
            overflow: "clip",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: "0.75rem",
            overflow: "clip",
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            fontSize: "0.8rem",
            marginTop: "0.3rem",
          },
        },
      },
    },
  });
};
