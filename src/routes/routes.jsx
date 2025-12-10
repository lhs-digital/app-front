import { createBrowserRouter } from "react-router-dom";
import FirstAccess from "../modules/base/FirstAccess";
import Logout from "../modules/public/Logout";
import PasswordUpdate from "../modules/public/PasswordUpdate";
import PickCompany from "../modules/public/PickCompany";
import RecoverPassword from "../modules/public/RecoverPassword";
import SignIn from "../modules/public/SignIn";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NotFound } from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { routes } from "./modules";

const publicRoutes = [
  {
    label: "Login",
    path: "/",
    element: <SignIn />,
  },
  {
    label: "Recuperar Senha",
    path: "/recover-password",
    element: <RecoverPassword />,
  },
  {
    label: "Selecionar Empresa",
    path: "/selecionar-empresa",
    element: <PickCompany />,
  },
  {
    label: "Atualizar Senha",
    path: "/password-update/:token",
    element: <PasswordUpdate />,
  },
  {
    label: "Primeiro Acesso",
    path: "/first-access/:token",
    permissions: ["view_any_tasks", "update_tasks"],
    element: <FirstAccess />,
  },
];

export const AppRoutes = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: publicRoutes,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <PrivateRoute />,
    children: routes,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/logout",
    element: <Logout />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
