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

const iconStyles = {
  fontSize: "small",
};

const icons = {
  "/painel": {
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
  const Icon = icons[path]?.icon || Subject;
  const ActiveIcon = icons[path]?.activeIcon || Subject;

  return {
    icon: <Icon {...iconStyles} />,
    activeIcon: <ActiveIcon {...iconStyles} />,
  };
};
