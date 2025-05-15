import {
  AssignmentTurnedIn,
  AssignmentTurnedInOutlined,
  Build,
  BuildOutlined,
  Home as HomeIcon,
  HomeOutlined,
  Lock,
  LockOutlined,
  Person,
  PersonOutline,
  RuleFolder,
  RuleFolderOutlined,
  Settings,
  SettingsOutlined,
  Subject,
  TableChart,
  TableChartOutlined,
} from "@mui/icons-material";
import AuditList from "../modules/audit/AuditList";
import AuditRules from "../modules/audit/AuditRules";
import Home from "../modules/base/Home";
import MyPermissions from "../modules/base/MyPermissions";
import Roles from "../modules/base/Roles";
import Users from "../modules/base/Users";
import WorkOrder from "../modules/base/WorkOrder";
import Companies from "../modules/lighthouse/Companies";
import Logs from "../modules/lighthouse/Logs";

const auditModule = {
  title: "Auditoria",
  children: [
    {
      label: "Itens auditados",
      path: "/auditorias",
      element: <AuditList />,
      icon: BuildOutlined,
      activeIcon: Build,
    },
    {
      label: "Regras",
      path: "/regras",
      element: <AuditRules />,
      icon: RuleFolderOutlined,
      activeIcon: RuleFolder,
    },
    {
      label: "Tabelas",
      path: "/tabelas",
      // element: <AuditTables />,
      icon: TableChartOutlined,
      activeIcon: TableChart,
    },
  ],
};

const baseModule = {
  title: "Início",
  children: [
    {
      label: "Início",
      path: "/painel",
      element: <Home />,
      icon: HomeOutlined,
      activeIcon: HomeIcon,
    },
    {
      label: "Ordens de Serviço",
      path: "/atribuicoes",
      element: <WorkOrder />,
      icon: AssignmentTurnedInOutlined,
      activeIcon: AssignmentTurnedIn,
    },
    {
      label: "Papéis & Permissões",
      path: "/papeis",
      element: <Roles />,
      icon: LockOutlined,
      activeIcon: Lock,
    },
    {
      label: "Usuários",
      path: "/usuarios",
      element: <Users />,
      icon: PersonOutline,
      activeIcon: Person,
    },
    {
      label: "Minhas Permissões",
      path: "/permissoes",
      element: <MyPermissions />,
      icon: SettingsOutlined,
      activeIcon: Settings,
    },
    {
      label: "Logs",
      path: "/logs",
      element: <Logs />,
      icon: Subject,
      activeIcon: Subject,
    },
  ],
};

const lighthouseModule = {
  title: "Administração",
  children: [
    {
      label: "Empresas",
      path: "/empresas",
      element: <Companies />,
    },
  ],
};

export const modules = [baseModule, auditModule, lighthouseModule];
