import {
  ExpandLess,
  ExpandMore,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useCallback, useEffect, useRef, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useLocation, useNavigate } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";
import { useUserState } from "../../hooks/useUserState";
import { modules } from "../../routes/modules";
import { routeIcon } from "./RouteIcon";

const DRAWER_WIDTH_MIN = 200;
const DRAWER_WIDTH_MAX = 400;
const DRAWER_WIDTH_CLOSED = 64;
const DRAWER_WIDTH_DEFAULT = 240;

const Drawer = MuiDrawer;

/**
 * Recursive component for rendering menu items
 */
const SidebarMenuItem = ({
  item,
  open,
  collapsedChildren,
  onToggleCollapse,
  onNavigate,
  hasPermission,
  isActive,
  depth = 0,
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const user = useAuthUser();

  // Check permissions
  if (item?.permissions && item?.permissions.length > 0) {
    if (!hasPermission(item.permissions)) {
      return null;
    }
  }

  // Filter out hidden children for display
  const visibleChildren = item.children?.filter((child) => !child.hidden) || [];
  const hasVisibleChildren = visibleChildren.length > 0;
  const isItemOpen = collapsedChildren[item.label] || false;
  const isPathActive = item.path && isActive(item.path);
  const menuOpen = Boolean(menuAnchor);

  const handleClick = (event) => {
    if (!open && hasVisibleChildren) {
      // When collapsed, show menu for items with children
      setMenuAnchor(event.currentTarget);
    } else if (open && hasVisibleChildren) {
      // When open, toggle collapse
      onToggleCollapse(item.label);
    } else if (item.path) {
      // Navigate to path
      onNavigate(item.path);
      setMenuAnchor(null);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuItemClick = (childPath) => {
    onNavigate(childPath);
    handleMenuClose();
  };

  return (
    <>
      <ListItem disablePadding>
        <Tooltip title={!open ? item.label : ""} placement="right" arrow>
          <ListItemButton
            onClick={handleClick}
            selected={isPathActive}
            sx={{
              minHeight: 48,
              px: open ? 3 : 2,
              pl: open ? 3 + depth * 2 : 2,
              justifyContent: open ? "flex-start" : "center",
              "&.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.08)",
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(0, 0, 0, 0.12)",
                },
                "& .MuiListItemIcon-root": {
                  color: theme.palette.primary.main,
                },
                "& .MuiListItemText-primary": {
                  fontWeight: 600,
                },
              },
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: "center",
                mr: open ? 2 : 0,
                color: isPathActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                opacity: isItemOpen && hasVisibleChildren && open ? 0.6 : 1,
              }}
            >
              {routeIcon(item, isPathActive)}
            </ListItemIcon>
            {open && (
              <>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontSize: "0.875rem",
                      fontWeight: isPathActive ? 600 : 400,
                    },
                  }}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "block",
                    whiteSpace: "nowrap",
                    width: "min-content",
                    maxWidth: "100%",
                    marginRight: "8px",
                  }}
                />
                {hasVisibleChildren && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {isItemOpen ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </>
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>

      {/* Collapsed state menu */}
      {!open && hasVisibleChildren && (
        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                minWidth: 200,
                maxHeight: 400,
                overflow: "auto",
                borderRadius: 0,
              },
            },
          }}
        >
          {visibleChildren.map((child) => {
            if (child.super && !user.isLighthouse) {
              return null;
            }

            // Check child permissions
            if (
              child?.permissions &&
              child.permissions.length > 0 &&
              !hasPermission(child.permissions)
            ) {
              return null;
            }

            const isChildActive = child.path && isActive(child.path);
            const hasGrandchildren =
              child.children?.filter((gc) => !gc.hidden).length > 0;

            return (
              <MenuItem
                key={child.path || child.label}
                onClick={() => handleMenuItemClick(child.path)}
                selected={isChildActive}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.08)",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.12)"
                          : "rgba(0, 0, 0, 0.12)",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {routeIcon(child, isChildActive)}
                </ListItemIcon>
                <ListItemText
                  primary={child.label}
                  slotProps={{
                    primary: {
                      fontSize: "0.875rem",
                      fontWeight: isChildActive ? 600 : 400,
                    },
                  }}
                />
                {hasGrandchildren && (
                  <Box
                    sx={{
                      ml: 1,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    <ExpandMore fontSize="small" />
                  </Box>
                )}
              </MenuItem>
            );
          })}
        </Menu>
      )}

      {/* Expanded state collapse */}
      {open && hasVisibleChildren && (
        <Collapse in={isItemOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {visibleChildren.map((child) =>
              child.super && !user.isLighthouse ? null : (
                <SidebarMenuItem
                  key={child.path || child.label}
                  item={child}
                  open={open}
                  collapsedChildren={collapsedChildren}
                  onToggleCollapse={onToggleCollapse}
                  onNavigate={onNavigate}
                  hasPermission={hasPermission}
                  isActive={isActive}
                  depth={depth + 1}
                />
              ),
            )}
          </List>
        </Collapse>
      )}
    </>
  );
};

const Sidebar = ({ open, setOpen, width, setWidth }) => {
  const user = useAuthUser();
  const signOut = useSignOut();
  const theme = useTheme();
  const [collapsedChildren, setCollapsedChildren] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions } = useUserState().state;
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

  const isActive = (path) => {
    if (!path) return false;
    const currentPath = location.pathname;

    // Exact match
    if (currentPath === path) return true;

    // Check if current path starts with this path (for nested routes)
    // But avoid matching "/" with everything
    if (path !== "/" && currentPath.startsWith(path + "/")) return true;

    return false;
  };

  const handleToggleCollapse = (label) => {
    setCollapsedChildren((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleNavigate = (path) => {
    if (path) navigate(path);
  };

  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef(false);
  const setWidthRef = useRef(setWidth);

  useEffect(() => {
    setWidthRef.current = setWidth;
  }, [setWidth]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizingRef.current) return;
    const newWidth = Math.min(
      DRAWER_WIDTH_MAX,
      Math.max(DRAWER_WIDTH_MIN, e.clientX),
    );
    setWidthRef.current(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizingRef.current = false;
    setIsResizing(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const handleDragStart = useCallback(
    (e) => {
      e.preventDefault();
      isResizingRef.current = true;
      setIsResizing(true);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp],
  );

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const filterVisibleModules = (items) => {
    return items.filter((item) => {
      if (item.super && !user.isLighthouse) {
        return false;
      }

      // Check permissions
      if (item?.permissions && item?.permissions.length > 0) {
        if (!hasPermission(item.permissions)) {
          return false;
        }
      }

      // Special case: hide Auditoria module if no company
      if (item.label === "Auditoria" && !company) {
        return false;
      }

      return true;
    });
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? width : DRAWER_WIDTH_CLOSED,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? width : DRAWER_WIDTH_CLOSED,
          boxSizing: "border-box",
          border: "none",
          borderRight: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
          transition: isResizing
            ? "none"
            : theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          overflowX: "hidden",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          height: 64,
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton
          size="small"
          onClick={() => setOpen(!open)}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Stack>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.2)"
                : "rgba(0, 0, 0, 0.2)",
            borderRadius: "0px",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.3)"
                  : "rgba(0, 0, 0, 0.3)",
            },
          },
        }}
      >
        <List disablePadding>
          {filterVisibleModules(modules).map((module) => (
            <SidebarMenuItem
              key={module.path || module.label}
              item={module}
              open={open}
              collapsedChildren={collapsedChildren}
              onToggleCollapse={handleToggleCollapse}
              onNavigate={handleNavigate}
              hasPermission={hasPermission}
              isActive={isActive}
            />
          ))}
        </List>
      </Box>

      <Divider />

      {open ? (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            component="button"
            onClick={() => navigate("/permissoes")}
            sx={{
              width: "100%",
              p: 1.5,
              borderRadius: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Avatar
              src={user?.avatar}
              alt={user?.name || "User"}
              sx={{
                width: 40,
                height: 40,
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {user?.company?.name}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.error.main,
                },
              }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Tooltip title={user?.name || "User"} placement="right" arrow>
            <IconButton
              onClick={() => navigate("/permissoes")}
              sx={{
                p: 0,
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <Avatar
                src={user?.avatar}
                alt={user?.name || "User"}
                sx={{
                  width: 32,
                  height: 32,
                }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sair" placement="right" arrow>
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.error.main,
                },
              }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      {open && (
        <Box
          onMouseDown={handleDragStart}
          role="separator"
          aria-label="Resize sidebar"
          tabIndex={0}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 4,
            cursor: "col-resize",
            zIndex: (t) => t.zIndex.drawer + 1,
            backgroundColor: "transparent",
            transition: "background-color 0.15s",
            "&:hover, &:active": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        />
      )}
    </Drawer>
  );
};

export { DRAWER_WIDTH_CLOSED, DRAWER_WIDTH_DEFAULT };
export default Sidebar;
