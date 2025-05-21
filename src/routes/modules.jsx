import {
  Assignment,
  AssignmentLate,
  AssignmentLateOutlined,
  AssignmentOutlined,
  Build,
  BuildOutlined,
  Home as HomeIcon,
  HomeOutlined,
  Lock,
  LockOutlined,
  Person,
  PersonOutline,
  PieChart,
  PieChartOutlined,
  RuleFolder,
  RuleFolderOutlined,
  Shield,
  ShieldOutlined,
  Store,
  StoreOutlined,
  Subject,
  TableChart,
  TableChartOutlined,
} from "@mui/icons-material";
import AuditList from "../modules/audit/AuditList";
import AuditRules from "../modules/audit/AuditRules";
import AuditTables from "../modules/audit/AuditTables";
import Home from "../modules/base/Home";
import MyPermissions from "../modules/base/MyPermissions";
import Roles from "../modules/base/Roles";
import RoleView from "../modules/base/RoleView";
import Users from "../modules/base/Users";
import WorkOrder from "../modules/base/WorkOrder";
import Companies from "../modules/lighthouse/Companies";
import Logs from "../modules/lighthouse/Logs";

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
    },
    {
      label: "Regras",
      path: "/regras",
      element: <AuditRules />,
      icon: RuleFolderOutlined,
      activeIcon: RuleFolder,
      permissions: ["define_rules"],
    },
    {
      label: "Tabelas",
      path: "/tabelas/(:table)/(:id)",
      element: <AuditTables />,
      icon: TableChartOutlined,
      activeIcon: TableChart,
      permissions: [
        "view_clients",
        "view_any_clients",
        "create_clients",
        "update_clients",
        "delete_clients",
      ],
    },
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
      icon: PieChartOutlined,
      activeIcon: PieChart,
    },
    {
      label: "Ordens de Serviço",
      path: "/atribuicoes",
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
      label: "Logs",
      path: "/logs",
      element: <Logs />,
      icon: Subject,
      activeIcon: Subject,
      permissions: ["view_any_logs"],
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
      icon: StoreOutlined,
      activeIcon: Store,
      permissions: [
        "view_companies",
        "view_any_companies",
        "create_companies",
        "update_companies",
        "delete_companies",
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

export const modules = [baseModule, auditModule, lighthouseModule];

const getRoutes = (acc, items) => {
  let accRoutes = acc;

  items.forEach((item) => {
    if (item.children && item.children.length > 0) {
      accRoutes = getRoutes(accRoutes, item.children);
    }

    if (item.path) {
      accRoutes = [
        ...accRoutes,
        {
          path: item.path,
          element: item.element,
        },
      ];
    }
  });

  return accRoutes;
};

export const routes = getRoutes([], [...modules, ...unrenderedRoutes]);

export const routePermissions = (pathname) => {
  const path = pathname.split("/")[0];
  const route = routes.find((route) => route.path === path);
  return route?.permissions || [];
};
