import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CompanyContextProvider } from "./contexts/companyContext";
import { ThemeModeProvider } from "./contexts/themeModeContext";
import { UserStateProvider } from "./contexts/userState";
import { AppRoutes } from "./routes/routes";
import { qc } from "./services/queryClient";

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
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider store={store}>
        <UserStateProvider>
          <CompanyContextProvider>
            <RouterProvider router={AppRoutes} />
            <ToastContainer position="bottom-right" />
          </CompanyContextProvider>
        </UserStateProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Root;
