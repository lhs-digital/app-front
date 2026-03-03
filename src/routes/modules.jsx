import {
  Assessment,
  AssessmentOutlined,
  Assignment,
  AssignmentLate,
  AssignmentLateOutlined,
  AssignmentOutlined,
  Build,
  BuildOutlined,
  BusinessCenter,
  BusinessCenterOutlined,
  Code,
  CodeOutlined,
  DynamicForm,
  DynamicFormOutlined,
  // Computer,
  // ComputerOutlined,
  Home as HomeIcon,
  HomeOutlined,
  Lock,
  LockOutlined,
  People,
  PeopleOutlined,
  Sell,
  SellOutlined,
  Settings,
  SettingsOutlined,
  // RuleFolder,
  // RuleFolderOutlined,
  Shield,
  ShieldOutlined,
  Subject,
  TableChart,
  TableChartOutlined,
  Troubleshoot,
  // Web,
  // WebOutlined,
  Widgets,
  WidgetsOutlined,
} from "@mui/icons-material";
import AuditDashboard from "../modules/audit/AuditDashboard";
import AuditList from "../modules/audit/AuditList";
import AuditModules from "../modules/audit/AuditModules";
// import AuditRules from "../modules/audit/AuditRules";
// import AuditTables from "../modules/audit/AuditTables";
import { Navigate } from "react-router-dom";
import AuditConfig from "../modules/audit/AuditConfig";
import EntityForm from "../modules/audit/EntityForm";
import ModuleTables from "../modules/audit/ModuleTable";
import ModuleView from "../modules/audit/ModuleView";
import MyPermissions from "../modules/base/MyPermissions";
import Roles from "../modules/base/Roles";
import RoleView from "../modules/base/RoleView";
import TestPage from "../modules/base/Test";
import Users from "../modules/base/Users";
import WorkOrder from "../modules/base/WorkOrder";
import WorkOrderView from "../modules/base/WorkOrder/WorkOrderView";
import Companies from "../modules/lighthouse/Companies";
import CompanyView from "../modules/lighthouse/Companies/CompanyView";
import Logs from "../modules/lighthouse/Logs";
import RegisterVpn from "../modules/lighthouse/RegisterVPN";
import Vpns from "../modules/lighthouse/Vpns";

const auditModule = {
  label: "Auditoria",
  icon: BuildOutlined,
  activeIcon: Build,
  children: [
    {
      label: "Painel",
      path: "/painel",
      element: <AuditDashboard />,
      icon: AssessmentOutlined,
      activeIcon: Assessment,
    },
    {
      label: "Itens auditados",
      path: "/auditorias",
      element: <AuditList />,
      icon: AssignmentLateOutlined,
      activeIcon: AssignmentLate,
      permissions: [
        "view_any_tasks",
        "view_tasks",
        "update_tasks",
        "view_any_reports",
        "report_generate",
        "define_rules",
      ],
      children: [
        {
          label: "...",
          path: "/auditorias/:module",
          element: <Navigate to="/auditorias" />,
          icon: DynamicFormOutlined,
          activeIcon: DynamicForm,
          hidden: true,
        },
        {
          label: "Item auditado",
          path: "/auditorias/:module/:id",
          element: <EntityForm />,
          icon: DynamicFormOutlined,
          activeIcon: DynamicForm,
          hidden: true,
        },
      ],
    },
    {
      label: "Regras de Auditoria",
      path: "/modulos",
      element: <AuditModules />,
      icon: WidgetsOutlined,
      activeIcon: Widgets,
      children: [
        {
          label: "Criar grupo de regras",
          path: "/modulos/criar",
          element: <ModuleView />,
          icon: WidgetsOutlined,
          activeIcon: Widgets,
          hidden: true,
        },
        {
          label: "Grupo de regras",
          path: "/modulos/:id",
          element: <ModuleView />,
          icon: TableChartOutlined,
          activeIcon: TableChart,
          hidden: true,
          children: [
            {
              label: "Tabelas",
              path: "/modulos/:id/:table",
              element: <ModuleTables />,
            },
          ],
        },
        {
          label: "Módulo",
          path: "/modulos/:id/editar",
          element: <ModuleView />,
          icon: TableChartOutlined,
          activeIcon: TableChart,
          hidden: true,
        },
        {
          label: "Adicionar tabela",
          path: "/modulos/:id/adicionar-tabela",
          element: <ModuleTables />,
          icon: TableChartOutlined,
          activeIcon: TableChart,
          hidden: true,
        },
      ],
    },
    {
      label: "Configurações e Logs",
      path: "/auditorias/configuracao",
      element: <AuditConfig />,
      icon: SettingsOutlined,
      activeIcon: Settings,
      hidden: true,
    },
  ],
};

const baseModule = {
  label: "Início",
  icon: HomeOutlined,
  activeIcon: HomeIcon,
  children: [
    {
      label: "Início",
      path: "/",
      element: <Navigate to="/" />,
      icon: HomeOutlined,
      activeIcon: HomeIcon,
    },
    {
      label: "Ordens de Serviço",
      path: "/ordens-de-servico",
      element: <WorkOrder />,
      icon: AssignmentOutlined,
      activeIcon: Assignment,
      permissions: [
        "view_any_work_orders",
        "view_work_orders",
        "update_work_orders",
        "create_work_orders",
        "delete_work_orders",
        "assign_work_orders",
        "be_assigned_work_orders",
      ],
      children: [
        {
          label: "Ver Ordem de Serviço",
          path: "/ordens-de-servico/:id",
          element: <WorkOrderView />,
          icon: AssignmentOutlined,
          activeIcon: Assignment,
          hidden: true,
        },
      ],
    },
  ],
};

const lighthouseModule = {
  label: "Administração",
  icon: ShieldOutlined,
  activeIcon: Shield,
  children: [
    {
      label: "Empresas",
      path: "/empresas",
      element: <Companies />,
      icon: BusinessCenterOutlined,
      activeIcon: BusinessCenter,
      super: true,
      permissions: [
        "view_companies",
        "view_any_companies",
        "create_companies",
        "update_companies",
        "delete_companies",
      ],
      children: [
        {
          label: "Ver Empresa",
          path: "/empresas/:id",
          element: <CompanyView />,
          icon: BusinessCenterOutlined,
          activeIcon: BusinessCenter,
          hidden: true,
        },
      ],
    },
    {
      label: "Usuários",
      path: "/usuarios",
      element: <Users />,
      icon: PeopleOutlined,
      activeIcon: People,
      permissions: [
        "view_users",
        "view_any_users",
        "create_users",
        "update_users",
        "delete_users",
        "assign_responsible_users",
        "unassign_responsible_users",
      ],
    },
    {
      label: "Papéis & Permissões",
      path: "/papeis",
      element: <Roles />,
      icon: SellOutlined,
      activeIcon: Sell,
      permissions: [
        "view_roles",
        "view_any_roles",
        "create_roles",
        "update_roles",
        "delete_roles",
        "view_from_company",
      ],
      children: [
        {
          label: "Papel",
          path: "/papeis/:id",
          element: <RoleView />,
          icon: SellOutlined,
          activeIcon: Sell,
          permissions: [
            "view_roles",
            "create_roles",
            "update_roles",
            "delete_roles",
            "view_from_company",
          ],
          hidden: true,
        },
      ],
    },
    {
      label: "VPNs",
      path: "/vpns",
      element: <Vpns />,
      icon: LockOutlined,
      activeIcon: Lock,
      super: true,
      children: [
        {
          label: "Registrar VPN",
          path: "/vpns/nova",
          element: <RegisterVpn />,
          icon: LockOutlined,
          activeIcon: Lock,
          hidden: true,
        },
      ],
    },
    {
      label: "Logs",
      path: "/logs",
      super: true,
      element: <Logs />,
      icon: Subject,
      activeIcon: Subject,
      permissions: ["view_any_logs"],
    },
  ],
};

export const unrenderedRoutes = [
  {
    label: "Minhas Permissões",
    path: "/permissoes",
    element: <MyPermissions />,
  },
];

const devModule = {
  label: "Desenvolvimento",
  icon: CodeOutlined,
  activeIcon: Code,
  children: [
    {
      label: "Teste",
      path: "/teste",
      element: <TestPage />,
      icon: Troubleshoot,
      activeIcon: Troubleshoot,
    },
  ],
};

export const modules = [
  baseModule,
  auditModule,
  lighthouseModule,
  ...(import.meta.env.MODE !== "production" ? [devModule] : []),
];

/**
 * Builds a flat array of routes from nested module structure
 */
const getRoutes = (acc, items, parent = null) => {
  let accRoutes = acc;

  items.forEach((item) => {
    if (item.children && item.children.length > 0) {
      accRoutes = getRoutes(accRoutes, item.children, item);
    }

    if (item.path) {
      const Icon = item.icon;
      const ActiveIcon = item.activeIcon;
      const route = {
        path: item.path,
        element: item.element,
        label: item.label,
        permissions: item.permissions,
        hidden: item.hidden,
        parent: parent ? { path: parent.path, label: parent.label } : null,
        ...(Icon && { icon: <Icon /> }),
        ...(ActiveIcon && { activeIcon: <ActiveIcon /> }),
      };
      accRoutes = [...accRoutes, route];
    }
  });

  return accRoutes;
};

export const routes = getRoutes([], [...modules, ...unrenderedRoutes]);

/**
 * Finds a route that matches the given pathname
 * Handles both exact matches and parameterized routes
 */
export const findRouteByPath = (pathname) => {
  // Try exact match first
  let route = routes.find((r) => r.path === pathname);
  if (route) return route;

  // Try parameterized route matching
  const pathSegments = pathname.split("/").filter(Boolean);

  for (const route of routes) {
    const routeSegments = route.path.split("/").filter(Boolean);

    if (routeSegments.length !== pathSegments.length) continue;

    const matches = routeSegments.every((segment, index) => {
      return segment === pathSegments[index] || segment.startsWith(":");
    });

    if (matches) return route;
  }

  return null;
};

/**
 * Builds breadcrumb trail from pathname
 * Constructs trail by matching each path segment to a route
 * Note: Home icon is handled separately in Layout component
 */
export const getBreadcrumbTrail = (pathname) => {
  const trail = [];
  const pathSegments = pathname.split("/").filter(Boolean);

  // Build trail from path segments
  for (let i = 0; i < pathSegments.length; i++) {
    const path = `/${pathSegments.slice(0, i + 1).join("/")}`;
    const route = findRouteByPath(path);

    if (route && !route.hidden) {
      trail.push({
        path,
        label: route.label,
      });
    } else if (i === pathSegments.length - 1) {
      // For the last segment, if no route found, use the segment as label
      // This handles dynamic routes that might not be in the route list
      trail.push({
        path,
        label: pathSegments[i],
      });
    }
  }

  return trail;
};

export const routePermissions = (pathname) => {
  const route = findRouteByPath(pathname);
  return route?.permissions || [];
};

export const getIconByPath = (pathname) => {
  const route = findRouteByPath(pathname);
  return route?.icon || null;
};
