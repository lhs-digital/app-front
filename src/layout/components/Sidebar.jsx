import { ExpandLess, ExpandMore, Logout, Menu } from "@mui/icons-material";
import {
  Avatar,
  Collapse,
  colors,
  Divider,
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
import { useCompany } from "../../hooks/useCompany";
import { useUserState } from "../../hooks/useUserState";
import { modules } from "../../routes/modules";
import { handleMode } from "../../theme";
import { routeIcon } from "./RouteIcon";

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

const Sidebar = ({ open, setOpen }) => {
  const user = useAuthUser();
  const signOut = useSignOut();
  const theme = handleMode(useThemeMode().mode);
  const [collapsedChildren, setCollapsedChildren] = useState({});
  const navigate = useNavigate();
  const { permissions } = useUserState().state;
  const isActive = (url) => window.location.pathname === url;
  const { setCompany, company } = useCompany();

  const handleLogout = async () => {
    signOut();
    setCompany(null);
    localStorage.removeItem("company");
    localStorage.removeItem("user");
    navigate("/logout");
  };

  const hasPermission = (thePermissions) => {
    if (!permissions || permissions.length === 0) {
      return null;
    }
    return permissions.some((permission) =>
      thePermissions.includes(permission.name),
    );
  };

  const openChildren = (key) => {
    const isOpen = collapsedChildren[key] || false;
    setCollapsedChildren({
      [key]: !isOpen,
    });
  };

  const renderRouteItem = (item) => {
    if (item?.permissions && item?.permissions.length > 0) {
      if (!hasPermission(item?.permissions)) {
        return null;
      }
    }

    const hasChildren =
      item.children &&
      item.children.filter((child) => !child.hidden).length > 0;
    const isItemOpen = collapsedChildren[item.label] || false;
    const isPathActive = item.path && isActive(item.path);

    return (
      <ListItem
        disablePadding
        key={item.path || item.label}
        sx={{
          ...(hasChildren &&
            isItemOpen && {
              borderTop: "1px solid",
              borderColor: "primary.light",
            }),
        }}
      >
        <ListItemButton
          color="primary"
          disableGutters
          onClick={
            hasChildren
              ? () => openChildren(item.label)
              : () => item.path && navigate(item.path)
          }
          selected={isPathActive}
          sx={[
            { minHeight: 48, px: 3 },
            open ? { justifyContent: "initial" } : { justifyContent: "center" },
          ]}
        >
          <ListItemIcon
            color="primary"
            sx={[
              { minWidth: 0, justifyContent: "center" },
              open ? { mr: 2 } : { mr: 0 },
              isItemOpen ? { opacity: 0.5 } : { opacity: 1 },
              isPathActive && {
                color: colors.grey[theme === "light" ? 900 : 200],
              },
            ]}
          >
            {routeIcon(item, isPathActive)}
          </ListItemIcon>
          {open && (
            <>
              <ListItemText primary={item.label} />
              {hasChildren && (isItemOpen ? <ExpandLess /> : <ExpandMore />)}
            </>
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const renderModule = (items = []) => {
    if (!items || items.length === 0) return null;

    return items.map((item) => {
      if (
        item?.permissions &&
        item?.permissions.length > 0 &&
        !hasPermission(item?.permissions)
      ) {
        return null;
      }

      if (item.label === "Auditoria" && !company) {
        return null;
      }

      const isItemOpen = collapsedChildren[item.label] || false;
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.path || item.label}>
          <Tooltip title={!open ? item.label : ""} placement="right" arrow>
            {renderRouteItem(item)}
          </Tooltip>
          {hasChildren && (
            <Collapse
              in={collapsedChildren[item.label] || false}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {renderModule(item.children)}
              </List>
            </Collapse>
          )}
          {isItemOpen && <Divider />}
        </div>
      );
    });
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      slotProps={{
        paper: { style: { borderRadius: 0, borderTop: 0, borderBottom: 0 } },
      }}
    >
      <div className="h-16 p-4 w-full flex flex-row items-center border-b border-b-black/10 dark:border-b-white/15 justify-end">
        <IconButton size="small" onClick={() => setOpen(!open)}>
          <Menu />
        </IconButton>
      </div>
      <div className="grow overflow-y-scroll">{renderModule(modules)}</div>
      <Divider />
      {open ? (
        <div className="p-2 w-full flex flex-row items-center justify-between gap-2">
          <button
            aria-label="Perfil"
            onClick={() => navigate("/permissoes")}
            className="flex flex-row gap-4 text-left hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg p-2 pr-3"
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
          <IconButton color="info" onClick={handleLogout}>
            <Logout fontSize="small" />
          </IconButton>
        </div>
      ) : (
        <div className="p-2 py-4 mx-auto flex flex-col gap-4">
          <Tooltip title={user?.name} placement="right" arrow>
            <Avatar
              src={user?.user?.avatar}
              alt="Avatar"
              sx={{ width: 32, height: 32 }}
            />
          </Tooltip>
          <Tooltip title="Sair" placement="right" arrow>
            <IconButton color="info" onClick={handleLogout}>
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Drawer>
  );
};

export default Sidebar;
