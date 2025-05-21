import { HomeOutlined, NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs } from "@mui/material";
import { useMemo, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Link, matchPath, useLocation } from "react-router-dom";
import blackLogo from "../assets/lh_black.svg";
import whiteLogo from "../assets/lh_white.svg";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useThemeMode } from "../contexts/themeModeContext";
import { modules, unrenderedRoutes } from "../routes/modules";
import { handleMode } from "../theme";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
  const user = useAuthUser();
  const theme = handleMode(useThemeMode().mode);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const flatRoutes = useMemo(() => {
    const flatten = (items) =>
      items.reduce((acc, item) => {
        if (item.path && item.label)
          acc.push({ path: item.path, label: item.label });
        if (item.children) acc = acc.concat(flatten(item.children));
        return acc;
      }, []);
    return flatten([...modules, ...unrenderedRoutes]);
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="grow flex flex-col">
        <div className="h-16 border-b border-b-black/10 dark:border-b-white/15 flex flex-row items-center justify-between px-4">
          <Box className="flex flex-row gap-2 items-center">
            <img
              src={theme === "dark" ? whiteLogo : blackLogo}
              alt="Lighthouse"
              className="h-10 mb-1"
            />
            <p className="text-2xl font-bold">{user?.company?.name}</p>
          </Box>
          <div className="flex flex-row gap-2">
            <ThemeSwitcher />
          </div>
        </div>
        <div
          className="max-h-[calc(100vh-4rem)] px-8 pb-8 pt-4 overflow-y-scroll space-y-6"
          style={{
            width: sidebarOpen ? "calc(100vw - 320px)" : "calc(100vw - 65px)",
            transition: "width 0.3s ease-in-out",
          }}
        >
          {pathnames.length > 0 && pathnames[0] !== "painel" && (
            <Breadcrumbs
              aria-label="breadcrumb"
              className="items-center"
              separator={
                <NavigateNext
                  fontSize="small"
                  className="mt-0.5 text-gray-500 dark:text-gray-400"
                />
              }
            >
              <Link
                key="base"
                to="/"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-[--foreground-color]"
              >
                <HomeOutlined sx={{ fontSize: "18px" }} className="mb-0.5" />
              </Link>
              {pathnames.map((_, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const match = flatRoutes.find((r) =>
                  matchPath({ path: r.path, end: true }, to),
                );
                const label = match?.label || pathnames[index];
                return (
                  <Link
                    key={to}
                    to={to}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[--foreground-color] hover:underline"
                  >
                    {label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
