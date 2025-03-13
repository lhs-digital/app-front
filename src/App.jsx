import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserStateProvider } from "./contexts/userState";
import { AppRoutes } from "./routes/routes";
import { baseTheme } from "./theme";

const store = createStore({
  authType: "localstorage",
  authName: "_auth",
});

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: true,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => {
  return (
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
  );
};

export default App;
