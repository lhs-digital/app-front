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
import Home from "../modules/base/Home";
import Roles from "../modules/base/Roles";
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
      label: "Logs",
      path: "/logs",
      element: <Logs />,
      icon: Subject,
      activeIcon: Subject,
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
    },
  ],
};

export const modules = [baseModule, auditModule, lighthouseModule];
