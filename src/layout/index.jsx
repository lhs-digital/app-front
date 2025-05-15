import { HomeOutlined, NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs } from "@mui/material";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Link } from "react-router-dom";
import blackLogo from "../assets/lh_black.svg";
import whiteLogo from "../assets/lh_white.svg";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useThemeMode } from "../contexts/themeModeContext";
import { privateRoutes, privateSubRoutes } from "../routes/routes";
import { handleMode } from "../theme";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
  const user = useAuthUser();
  const theme = handleMode(useThemeMode().mode);
  const location = window.location.pathname.split("/").slice(1);

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <Sidebar />
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
        <div className="max-h-[calc(100vh-4rem)] px-8 pb-8 pt-4 overflow-y-scroll w-[calc(100vw-64px)] space-y-6">
          {location[0] !== "painel" && (
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
              {location.map((path, index) => {
                return (
                  <Link
                    key={index}
                    to={`/${location.slice(0, index + 1).join("/")}`}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-[--foreground-color] hover:underline"
                  >
                    {
                      [...privateRoutes, ...privateSubRoutes].find(
                        (route) =>
                          route.path === `/${path}` ||
                          route.path === `/${location[index - 1]}/:id`,
                      )?.label
                    }
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
