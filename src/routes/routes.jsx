import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../layout/PrivateRoute";
import PublicRoute from "../layout/PublicRoute";
import Assignments from "../pages/Assignments";
import Clients from "../pages/Clients";
import Companies from "../pages/Companies";
import FirstAccess from "../pages/FirstAccess";
import Home from "../pages/Home";
import ListActivities from "../pages/ListActivities";
import Logout from "../pages/Logout";
import Logs from "../pages/Logs";
import MyPermissions from "../pages/MyPermissions";
import PasswordUpdate from "../pages/PasswordUpdate";
import Priorities from "../pages/Priorities";
import RecoverPassword from "../pages/RecoverPassword";
import Roles from "../pages/Roles";
import SignIn from "../pages/SignIn";
import Users from "../pages/Users";
import { pagePermissions } from "../services/permissions";
import { RouteIcon } from "./utils";

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

export const privateRoutes = [
  {
    label: "Início",
    path: "/painel",
    element: <Home />,
  },
  {
    label: "Auditorias",
    path: "/auditorias",
    element: <ListActivities />,
  },
  {
    label: "Empresas",
    path: "/empresas",
    element: <Companies />,
  },
  {
    label: "Papéis & Permissões",
    path: "/papeis",
    element: <Roles />,
  },
  {
    label: "Usuários",
    path: "/usuarios",
    element: <Users />,
  },
  {
    label: "Clientes",
    path: "/clientes",
    element: <Clients />,
  },
  {
    label: "Atribuições",
    path: "/atribuicoes",
    element: <Assignments />,
  },
  {
    label: "Regras de Auditorias",
    path: "/prioridades",
    element: <Priorities />,
  },
  {
    label: "Minhas Permissões",
    path: "/permissoes",
    element: <MyPermissions />,
  },
  {
    label: "Logs",
    path: "/logs",
    element: <Logs />,
  },
];

export const navigationRoutes = privateRoutes.map((route) => ({
  ...route,
  icon: RouteIcon({ path: route.path }).icon,
  activeIcon: RouteIcon({ path: route.path }).activeIcon,
  permissions: pagePermissions(route.path),
}));

export const AppRoutes = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: publicRoutes,
  },
  {
    element: <PrivateRoute />,
    children: privateRoutes,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);
