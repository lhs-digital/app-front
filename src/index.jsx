import { ChakraProvider } from '@chakra-ui/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';


export const theme = createTheme({
  palette: {
    primary: {
      main: "#5A939F",
      light: "#8BC8D4",
      dark: "#214E61",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#EDDEA3",
      light: "#FFF7D8",
      dark: "#DDD2A9",
      contrastText: "#07181F",
    },
    info: {
      main: "#6b7280",
      light: "#8898AA",
      dark: "#44515F",
      contrastText: "#FFF",
    },
  },
  typography: {
    fontFamily: "Onest",
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: "#5A939F",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#FFF",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: "large",
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          overflow: "clip",
        },
      },
    },
  },
});

const root = createRoot(document.getElementById('root'))

root.render(
    <ChakraProvider>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </ChakraProvider>
)