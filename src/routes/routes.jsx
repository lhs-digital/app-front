import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../layout/PrivateRoute";
import PublicRoute from "../layout/PublicRoute";
import WorkOrder from "../modules/base/WorkOrder";
import AuditList from "../modules/audit/AuditList";
import AuditRules from "../modules/audit/AuditRules";
import Clients from "../modules/base/Clients";
import ClientView from "../modules/base/ClientView";
import Companies from "../modules/lighthouse/Companies";
import FinancialAuditView from "../modules/base/FinancialView";
import FirstAccess from "../modules/base/FirstAccess";
import Home from "../modules/base/Home";
import Logout from "../modules/public/Logout";
import Logs from "../modules/lighthouse/Logs";
import MyPermissions from "../modules/base/MyPermissions";
import PasswordUpdate from "../modules/public/PasswordUpdate";
import RecoverPassword from "../modules/public/RecoverPassword";
import Roles from "../modules/base/Roles";
import RoleView from "../modules/base/RoleView";
import SignIn from "../modules/public/SignIn";
import Users from "../modules/base/Users";
import { pagePermissions } from "../services/permissions";
import { RouteIcon } from "../layout/components/RouteIcon";

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
    element: <AuditList />,
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
    label: "Ordens de Serviço",
    path: "/atribuicoes",
    element: <WorkOrder />,
  },
  // {
  //   label: "Regras de Auditorias",
  //   path: "/prioridades",
  //   element: <Priorities />,
  // },
  {
    label: "Regras de Auditoria",
    path: "/regras",
    element: <AuditRules />,
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

export const privateSubRoutes = [
  {
    label: "Cliente",
    path: "/clientes/:id",
    element: <ClientView />,
    super: true,
  },
  {
    label: "Financeiro",
    path: "/financeiro/:id",
    element: <FinancialAuditView />,
    super: true,
  },
  {
    label: "Cargo",
    path: "/papeis/:id",
    element: <RoleView />,
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
    children: [...privateRoutes, ...privateSubRoutes].map((route) => ({
      ...route,
      permissions: pagePermissions(route.path),
    })),
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);
