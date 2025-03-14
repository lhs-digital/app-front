import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserStateProvider } from "./contexts/userState";
import { AppRoutes } from "./routes/routes";
import { qc } from "./services/queryClient";
import { baseTheme } from "./theme";

const store = createStore({
  authType: "localstorage",
  authName: "_auth",
});

const App = () => {
  return (
    <StrictMode>
      <ThemeProvider theme={baseTheme}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <AuthProvider store={store}>
            <UserStateProvider>
              <RouterProvider router={AppRoutes} />
              <ToastContainer position="bottom-right" />
            </UserStateProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
};

export default App;
