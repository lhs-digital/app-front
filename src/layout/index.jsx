import {
  Build,
  BuildOutlined,
  Business,
  BusinessOutlined,
  Home,
  HomeOutlined,
  Lock,
  LockOutlined,
  Logout,
  Menu,
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
import {
  Avatar,
  colors,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import lighthouse from "../assets/favicon_neutral.svg";
import { AuthContext } from "../contexts/auth";

const drawerWidth = 320;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const Index = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isActive = (url) => window.location.pathname === url;

  const handleLogout = async () => {
    logout();
    navigate("/");
  };


  const { permissions } = useContext(AuthContext);
  const usersPermissions = [
    "view_users",
    "view_any_users",
    "update_users",
    "delete_users",
  ];
  const companyPermissions = [
    "view_companies",
    "view_any_companies",
    "update_companies",
    "delete_companies",
  ];
  //eslint-disable-next-line
  const rolesPermissions = [
    "view_roles",
    "view_any_roles",
    "update_roles",
    "delete_roles",
  ];
  //eslint-disable-next-line
  const auditoriaPermissions = ["view_any_tasks", "update_tasks"];
  const relatorioPermissions = ["view_any_reports", "report_generate"];
  const defineRules = ["define_rules"];

  const hasPermission = (thePermissions) => {
    console.log("Verificando permissões:", permissions);
    console.log("Necessárias para o item:", thePermissions);

    return permissions.some((permission) =>
      thePermissions.includes(permission.name)
    );
  };

  const sidebarItems = [
    {
      label: "Início",
      url: "/dashboard",
      icon: <HomeOutlined fontSize="small" />,
      activeIcon: <Home fontSize="small" />,
      permissions: [], // Disponível para todos
    },
    {
      label: "Auditorias",
      url: "/audits",
      icon: <BuildOutlined fontSize="small" />,
      activeIcon: <Build fontSize="small" />,
      permissions: auditoriaPermissions,
    },
    {
      label: "Empresas",
      url: "/companies",
      icon: <BusinessOutlined fontSize="small" />,
      activeIcon: <Business fontSize="small" />,
      permissions: companyPermissions,
    },
    {
      label: "Papéis & Permissões",
      url: "/roles",
      icon: <LockOutlined fontSize="small" />,
      activeIcon: <Lock fontSize="small" />,
      permissions: rolesPermissions,
    },
    {
      label: "Usuários",
      url: "/users",
      icon: <PersonOutline fontSize="small" />,
      activeIcon: <Person fontSize="small" />,
      permissions: usersPermissions,
    },
    {
      label: "Clientes",
      url: "/clientes",
      icon: <WorkOutline fontSize="small" />,
      activeIcon: <Work fontSize="small" />,
      permissions: [], // Disponível para todos
    },
    {
      label: "Regras de Auditorias",
      url: "/prioridades",
      icon: <RuleFolderOutlined fontSize="small" />,
      activeIcon: <RuleFolder fontSize="small" />,
      permissions: defineRules,
    },
    {
      label: "Minhas Permissões",
      url: "/my-permissions",
      icon: <SettingsOutlined fontSize="small" />,
      activeIcon: <Settings fontSize="small" />,
      permissions: [], // Disponível para todos
    },
    {
      label: "Logs",
      url: "/logs",
      icon: <Subject fontSize="small" />,
      activeIcon: <Subject fontSize="small" />,
      permissions: relatorioPermissions,
    },
  ];

  return (
    <div className="flex flex-row h-screen w-full">
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ style: { borderRadius: 0 } }}
      >
        <div className="h-16 p-4 w-full flex flex-row items-center border-b justify-end">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            <Menu />
          </IconButton>
        </div>
        <List className="grow">
          {sidebarItems.map((item, index) => {
            if (item.permissions && item.permissions.length > 0 && !hasPermission(item.permissions)) {
              return null; // Não renderiza se não tiver permissão
            }

            return (
              <Tooltip title={item.label} key={index} hidden={!open} placement="right">
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => navigate(item.url)}
                    selected={isActive(item.url)}
                    sx={[
                      { minHeight: 48, px: 3 },
                      open ? { justifyContent: "initial" } : { justifyContent: "center" },
                    ]}
                  >
                    <ListItemIcon
                      sx={[
                        { minWidth: 0, justifyContent: "center" },
                        open ? { mr: 3 } : { mr: "auto" },
                        isActive(item.url) && { color: colors.grey[900] },
                      ]}
                    >
                      {isActive(item.url) ? item.activeIcon : item.icon}
                    </ListItemIcon>
                    {open && <ListItemText primary={item.label} />}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
        {open ? (
          <div className="p-4">
            <button
              aria-label="Perfil"
              onClick={() => navigate("/my-permissions")}
              className="w-full text-left p-2 flex flex-row items-center border rounded-lg gap-2 hover:bg-gray-50"
            >
              <Avatar
                src={user?.user?.avatar}
                alt="Avatar"
                sx={{ width: 48, height: 48 }}
              />
              <div className="flex flex-col">
                <p className="font-medium">{user?.user?.name}</p>
                <p className="text-sm">{user?.user?.company?.name}</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="p-2 mx-auto">
            <Avatar
              src={user?.user?.avatar}
              alt="Avatar"
              sx={{ width: 32, height: 32 }}
            />
          </div>
        )}
      </Drawer>
      <div className="grow flex flex-col">
        <div className="h-16 border-b flex flex-row items-center justify-between px-4">
          <img src={lighthouse} alt="Lighthouse" className="h-10 mb-1" />
          <div className="flex flex-row gap-2">
            <IconButton color="info" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </div>
        </div>
        <div className="max-h-[calc(100vh-4rem)] p-8 overflow-y-scroll">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Index;
