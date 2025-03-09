import { CssBaseline, ThemeProvider } from "@mui/material";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { RouterProvider } from "react-router-dom";
import { UserStateProvider } from "./contexts/userState";
import { AppRoutes } from "./routes/routes";
import { baseTheme } from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const store = createStore({
  authType: "localstorage",
  authName: "_auth",
});

const App = () => {
  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <AuthProvider store={store}>
        <UserStateProvider>
          <RouterProvider router={AppRoutes} />
          <ToastContainer />
        </UserStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
