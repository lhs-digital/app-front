import { CheckCircle, Error, Info, Warning } from "@mui/icons-material";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CompanyContextProvider } from "./contexts/companyContext";
import { ThemeModeProvider, useThemeMode } from "./contexts/themeModeContext";
import { UserStateProvider } from "./contexts/userState";
import { AppRoutes } from "./routes/routes";
import { qc } from "./services/queryClient";
import { handleMode } from "./theme";

const store = createStore({
  authType: "localstorage",
  authName: "_auth",
});

const Root = () => {
  return (
    <StrictMode>
      <ThemeModeProvider>
        <App />
      </ThemeModeProvider>
    </StrictMode>
  );
};

function App() {
  const theme = handleMode(useThemeMode().mode);
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider store={store}>
        <UserStateProvider>
          <CompanyContextProvider>
            <RouterProvider router={AppRoutes} />
            <ToastContainer
              position="bottom-right"
              pauseOnFocusLoss={false}
              icon={({ type }) => {
                switch (type) {
                  case "success":
                    return <CheckCircle color="success" />;
                  case "error":
                    return <Error color="error" />;
                  case "warning":
                    return <Warning color="warning" />;
                  case "info":
                    return <Info color="info" />;
                  default:
                    return null;
                }
              }}
              theme={theme}
            />
          </CompanyContextProvider>
        </UserStateProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Root;
