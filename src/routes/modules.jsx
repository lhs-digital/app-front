import {
  Assignment,
  AssignmentLate,
  AssignmentLateOutlined,
  AssignmentOutlined,
  AutoAwesomeMosaic,
  AutoAwesomeMosaicOutlined,
  Build,
  BuildOutlined,
  BusinessCenter,
  BusinessCenterOutlined,
  DynamicForm,
  DynamicFormOutlined,
  // Computer,
  // ComputerOutlined,
  Home as HomeIcon,
  HomeOutlined,
  Lock,
  LockOutlined,
  Person,
  PersonOutline,
  // RuleFolder,
  // RuleFolderOutlined,
  Shield,
  ShieldOutlined,
  Subject,
  TableChart,
  TableChartOutlined,
  VpnLock,
  VpnLockOutlined,
  // Web,
  // WebOutlined,
  Widgets,
  WidgetsOutlined,
} from "@mui/icons-material";
import AuditList from "../modules/audit/AuditList";
import AuditModules from "../modules/audit/AuditModules";
// import AuditRules from "../modules/audit/AuditRules";
// import AuditTables from "../modules/audit/AuditTables";
import EntityForm from "../modules/audit/EntityForm";
import ModuleTables from "../modules/audit/ModuleTable";
import ModuleForm from "../modules/audit/ModuleView";
import Home from "../modules/base/Home";
import MyPermissions from "../modules/base/MyPermissions";
import Roles from "../modules/base/Roles";
import RoleView from "../modules/base/RoleView";
// import TestPage from "../modules/base/Test";
import { Navigate } from "react-router-dom";
import Users from "../modules/base/Users";
import WorkOrder from "../modules/base/WorkOrder";
import Companies from "../modules/lighthouse/Companies";
import Logs from "../modules/lighthouse/Logs";
import Vpns from "../modules/lighthouse/Vpns";

const auditModule = {
  label: "Auditoria",
  icon: BuildOutlined,
  activeIcon: Build,
  children: [
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
          element: <ModuleForm />,
          icon: WidgetsOutlined,
          activeIcon: Widgets,
          hidden: true,
        },
        {
          label: "Grupo de regras",
          path: "/modulos/:id",
          element: <ModuleForm />,
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
          element: <ModuleForm />,
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
    }
  ],
};

const baseModule = {
  label: "Início",
  icon: HomeOutlined,
  activeIcon: HomeIcon,
  children: [
    {
      label: "Painel",
      path: "/painel",
      element: <Home />,
      icon: AutoAwesomeMosaicOutlined,
      activeIcon: AutoAwesomeMosaic,
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
      permissions: [
        "view_companies",
        "view_any_companies",
        "create_companies",
        "update_companies",
        "delete_companies",
      ],
    },
    {
      label: "Logs",
      path: "/logs",
      element: <Logs />,
      icon: Subject,
      activeIcon: Subject,
      permissions: ["view_any_logs"],
    },
    {
      label: "Usuários",
      path: "/usuarios",
      element: <Users />,
      icon: PersonOutline,
      activeIcon: Person,
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
      icon: LockOutlined,
      activeIcon: Lock,
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
          icon: LockOutlined,
          activeIcon: Lock,
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
      icon: VpnLockOutlined,
      activeIcon: VpnLock,
      children: [
      ],
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

export const modules = [
  baseModule,
  auditModule,
  lighthouseModule,
  // ...(import.meta.env.MODE !== "production" ? [devModule] : []),
];

const getRoutes = (acc, items) => {
  let accRoutes = acc;

  items.forEach((item) => {
    if (item.children && item.children.length > 0) {
      accRoutes = getRoutes(accRoutes, item.children);
    }

    if (item.path) {
      const Icon = item.icon;
      const ActiveIcon = item.activeIcon;
      accRoutes = [
        ...accRoutes,
        {
          path: item.path,
          element: item.element,
          label: item.label,
          ...(Icon && { icon: <Icon /> }),
          ...(ActiveIcon && { activeIcon: <ActiveIcon /> }),
        },
      ];
    }
  });

  return accRoutes;
};

export const routes = getRoutes([], [...modules, ...unrenderedRoutes]);

export const routePermissions = (pathname) => {
  const path = pathname.split("/")[1];
  const route = routes.find((route) => route.path === path);
  return route?.permissions || [];
};

export const getIconByPath = (pathname) => {
  const path = pathname.split("/")[1];
  const route = routes.find((route) => route.path === `/${path}`);
  return route?.icon || null;
};
