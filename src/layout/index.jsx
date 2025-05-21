import {
  HomeOutlined,
  NavigateNext,
  SaveOutlined,
  SwapHoriz,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";
import blackLogo from "../assets/lh_black.svg";
import whiteLogo from "../assets/lh_white.svg";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useThemeMode } from "../contexts/themeModeContext";
import { useCompany } from "../hooks/useCompany";
import { routes } from "../routes/modules";
import { handleMode } from "../theme";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
  const { company, availableCompanies, setCompany } = useCompany();
  const [selectedCompany, setSelectedCompany] = useState(company || "");
  const theme = handleMode(useThemeMode().mode);
  const location = useLocation();
  const [editingCompany, setEditingCompany] = useState(false);
  const pathnames = location.pathname.split("/").filter(Boolean);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const onCompanyChangeClick = () => {
    if (!editingCompany) {
      setEditingCompany(true);
      return;
    }

    setCompany(selectedCompany);
    setEditingCompany(false);
  };

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
            {editingCompany ? (
              <div className="min-w-[200px]">
                <Select
                  size="small"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  fullWidth
                  disabled={availableCompanies.length === 0}
                >
                  {availableCompanies.map((company) => (
                    <MenuItem key={company.id} value={company}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ) : (
              <p className="text-2xl font-bold">{company?.name}</p>
            )}
            <Tooltip
              title={editingCompany ? "Salvar" : "Alterar empresa"}
              arrow
              placement="right"
            >
              <IconButton onClick={onCompanyChangeClick}>
                {editingCompany ? (
                  <SaveOutlined fontSize="small" />
                ) : (
                  <SwapHoriz fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
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
                const match = routes.find((r) =>
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
