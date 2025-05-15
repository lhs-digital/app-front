import { Logout, Menu } from "@mui/icons-material";
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
import { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../../contexts/themeModeContext";
import { useUserState } from "../../hooks/useUserState";
import { modules } from "../../routes/modules";
import { handleMode } from "../../theme";

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

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const user = useAuthUser();
  const signOut = useSignOut();
  const theme = handleMode(useThemeMode().mode);
  const navigate = useNavigate();
  const { permissions } = useUserState().state;
  const isActive = (url) => window.location.pathname === url;

  const handleLogout = async () => {
    signOut();
    navigate("/");
  };

  const hasPermission = (thePermissions) => {
    if (!permissions || permissions.length === 0) {
      return null;
    }
    return permissions.some((permission) =>
      thePermissions.includes(permission.name),
    );
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      PaperProps={{ style: { borderRadius: 0 } }}
    >
      <div className="h-16 p-4 w-full flex flex-row items-center border-b border-b-black/10 dark:border-b-white/15 justify-end">
        <IconButton size="small" onClick={() => setOpen(!open)}>
          <Menu />
        </IconButton>
      </div>
      <List className="grow">
        {modules.map((item, index) => {
          if (
            item?.permissions &&
            item?.permissions.length > 0 &&
            !hasPermission(item?.permissions)
          ) {
            return null;
          }
          return (
            <Tooltip
              title={item.label}
              key={index}
              hidden={!open}
              placement="right"
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive(item.path)}
                  sx={[
                    { minHeight: 48, px: 3 },
                    open
                      ? { justifyContent: "initial" }
                      : { justifyContent: "center" },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      { minWidth: 0, justifyContent: "center" },
                      open ? { mr: 3 } : { mr: "auto" },
                      isActive(item.path) && {
                        color: colors.grey[theme === "light" ? 900 : 200],
                      },
                    ]}
                  >
                    {isActive(item.path) ? item.activeIcon : item.icon}
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
            onClick={() => navigate("/permissoes")}
            className="w-full text-left p-2 flex flex-row items-center border rounded-lg gap-2 hover:bg-gray-50"
          >
            <Avatar
              src={user?.avatar}
              alt="Avatar"
              sx={{ width: 48, height: 48 }}
            />
            <div className="flex flex-col">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm">{user?.company?.name}</p>
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
      <div className="py-2 flex flex-col items-center justify-center">
        <IconButton color="info" onClick={handleLogout}>
          <Logout fontSize="small" />
        </IconButton>
      </div>
    </Drawer>
  );
};

export default Sidebar;
