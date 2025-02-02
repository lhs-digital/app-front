import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./contexts/auth";
import RoutesApp from "./routes";
import { baseTheme } from "./theme";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={baseTheme}>
        <CssBaseline />
        <AuthProvider>
          <RoutesApp />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
