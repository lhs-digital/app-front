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
    main: "#71717a",
    light: "#a1a1aa",
    dark: "#52525b",
    contrastText: "#1D1F21",
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
  warning: {
    main: "#ff9800",
    light: "#ffd146",
    dark: "#e27100",
    contrastText: "#1D1F21",
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
    main: "#71717a",
    light: "#a1a1aa",
    dark: "#52525b",
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
  warning: {
    main: "#ff9800",
    light: "#ffd146",
    dark: "#e27100",
    contrastText: "#1D1F21",
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
            borderRadius: "0.5rem",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
          size: "medium",
        },
        styleOverrides: {
          root: {
            borderRadius: "0.75rem",
            paddingY: "0.255rem",
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
        defaultProps: {
          size: "medium",
        },
        styleOverrides: {
          root: {
            padding: "2px 4px",
            borderRadius: "0.75rem",
            overflow: "clip",
            height: "46px",
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
      MuiInputLabel: {
        styleOverrides: {
          root: {
            transform: "translate(14px, 12px) scale(1)",
          },
          shrink: {
            transform: "translate(14px, -9px) scale(0.75)",
          },
          "&.Mui-focused": {
            transform: "translate(14px, -9px) scale(0.75)",
          },
        },
      },
    },
  });
};

export const themeColors = {
  dark: {
    ...darkPalette,
  },
  light: {
    ...lightPalette,
  },
};
