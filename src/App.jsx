import { CssBaseline, ThemeProvider } from "@mui/material";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { RouterProvider } from "react-router-dom";
import { UserStateProvider } from "./contexts/userState";
import { AppRoutes } from "./routes/routes";
import { baseTheme } from "./theme";

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
        </UserStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
