import {
  Assignment,
  AssignmentOutlined,
  Build,
  BuildOutlined,
  Business,
  BusinessOutlined,
  Home,
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
  Work,
  WorkOutline,
} from "@mui/icons-material";
import { pagePermissions } from "../services/permissions";
import { privateRoutes } from "./routes";

const icons = {
  "/dashboard": {
    icon: HomeOutlined,
    activeIcon: Home,
  },
  "/auditorias": {
    icon: BuildOutlined,
    activeIcon: Build,
  },
  "/empresas": {
    icon: BusinessOutlined,
    activeIcon: Business,
  },
  "/papeis": {
    icon: LockOutlined,
    activeIcon: Lock,
  },
  "/usuarios": {
    icon: PersonOutline,
    activeIcon: Person,
  },
  "/clientes": {
    icon: WorkOutline,
    activeIcon: Work,
  },
  "/atribuicoes": {
    icon: AssignmentOutlined,
    activeIcon: Assignment,
  },
  "/prioridades": {
    icon: RuleFolderOutlined,
    activeIcon: RuleFolder,
  },
  "/permissoes": {
    icon: SettingsOutlined,
    activeIcon: Settings,
  },
  "/logs": {
    icon: Subject,
    activeIcon: Subject,
  },
};

export const RouteIcon = ({ path }) => {
  return icons[path] || { icon: Subject, activeIcon: Subject };
};

export const navigationRoutes = privateRoutes.map((route) => {
  return {
    ...route,
    icon: RouteIcon({ path: route.path }).icon,
    activeIcon: RouteIcon({ path: route.path }).activeIcon,
    permissions: pagePermissions(route.path),
  };
});
