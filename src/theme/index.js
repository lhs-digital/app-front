import { createTheme } from "@mui/material";

const lightPalette = {
  mode: "light",
  primary: {
    main: "#1D1F21",
    light: "#e4e6e7",
    dark: "#3f4346",
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
  success: {
    main: "#26ed7a",
    light: "#7afbb0",
    dark: "#06b350",
    contrastText: "#1D1F21",
  },
  error: {
    main: "#f73b51",
    light: "#ff7263",
    dark: "#c10f31",
    contrastText: "#fff",
  },
};

const darkPalette = {
  mode: "dark",
  primary: {
    main: "#fff",
    light: "#3f4346",
    dark: "#a1a5aa",
    contrastText: "#1D1F21",
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
  success: {
    main: "#26ed7a",
    light: "#7afbb0",
    dark: "#06b350",
    contrastText: "#1D1F21",
  },
  error: {
    main: "#f73b51",
    light: "#ff7263",
    dark: "#c10f31",
    contrastText: "#fff",
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
