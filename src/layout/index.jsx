import {
  HomeOutlined,
  NavigateNext,
  SwapHoriz,
  WarningRounded,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Link, useLocation, useNavigate } from "react-router-dom";
import blackLogo from "../assets/lh_black.svg";
import whiteLogo from "../assets/lh_white.svg";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useThemeMode } from "../contexts/themeModeContext";
import { useCompany } from "../hooks/useCompany";
import { getBreadcrumbTrail } from "../routes/modules";
import api from "../services/api";
import { handleMode } from "../theme";
import CompanySelect from "./components/CompanySelect";
import EnvironmentIndicator from "./components/EnvironmentIndicator";
import Sidebar from "./components/Sidebar";

const Layout = ({ children }) => {
  const { company, availableCompanies, setCompany } = useCompany();
  const [companyListOpen, setCompanyListOpen] = useState(false);
  const [companyToConfirm, setCompanyToConfirm] = useState(null);
  const theme = handleMode(useThemeMode().mode);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthUser();
  const navigate = useNavigate();

  const moduleId = pathnames.find(
    (path, index) => pathnames[index - 1] === "modulos" && path !== "criar",
  );

  const tableId = pathnames.find(
    (path, index) =>
      pathnames[index - 2] === "modulos" &&
      pathnames[index - 1] !== "modulos" &&
      pathnames[index - 1] !== "criar" &&
      /^\d+$/.test(path),
  );

  const { data: moduleData } = useQuery({
    queryKey: ["module", moduleId, company],
    queryFn: async () => {
      const response = await api.get(
        `/companies/${company.id}/audit/modules/${moduleId}`,
      );
      return response.data.data;
    },
    enabled: !!company && !!moduleId && moduleId !== "criar",
    retry: false,
  });

  const { data: tableData } = useQuery({
    queryKey: ["tables", company, tableId, moduleId],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/structure`, {
        params: { with_rules: moduleId },
      });
      const data = response.data.data.find((t) => t.id === parseInt(tableId));
      return data;
    },
    enabled: !!company && !!tableId && !!moduleId,
    retry: false,
  });

  useEffect(() => {
    const sidebarOpen = localStorage.getItem("sidebarOpen");
    setSidebarOpen(sidebarOpen === "true");
  }, []);

  useEffect(() => {
    if (!company && !user?.isLighthouse) {
      navigate("/");
    }
  }, [company, user]);

  const handleSelectCompany = (selected) => {
    setCompanyListOpen(false);
    setCompanyToConfirm(selected);
  };

  const handleConfirmCompanyChange = () => {
    setCompany(companyToConfirm);
    setCompanyToConfirm(null);
    navigate("/");
  };

  const onSidebarOpenChange = (value) => {
    setSidebarOpen(value);
    localStorage.setItem("sidebarOpen", value);
  };

  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={onSidebarOpenChange} />
      <div className="grow flex flex-col">
        <div className="h-16 border-b border-b-black/10 dark:border-b-white/15 flex flex-row items-center justify-between px-4">
          <Box className="flex flex-row gap-2 items-center">
            <img
              src={theme === "dark" ? whiteLogo : blackLogo}
              alt="Lighthouse"
              className="h-8 mb-2"
            />
            <p className="text-xl font-bold">
              {company?.name || (user?.isLighthouse ? "Lighthouse" : "")}
            </p>
            {user && user?.isLighthouse && (
              <Tooltip title="Alterar empresa" arrow placement="right">
                <IconButton onClick={() => setCompanyListOpen(true)}>
                  <SwapHoriz fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <div className="flex flex-row gap-4 items-center">
            <EnvironmentIndicator />
            <ThemeSwitcher />
          </div>
        </div>
        <motion.div
          className="max-h-[calc(100vh-4rem)] px-8 pb-8 pt-4 overflow-y-scroll space-y-6"
          style={{
            width: sidebarOpen ? "calc(100vw - 320px)" : "calc(100vw - 65px)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {pathnames.length > 0 && pathnames[0] !== "" && (
            <Breadcrumbs
              aria-label="breadcrumb"
              className="items-center"
              separator={
                <NavigateNext
                  fontSize="small"
                  className="mt-0.5 text-zinc-500 dark:text-zinc-400"
                />
              }
            >
              <Link
                key="base"
                to="/"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[--foreground-color]"
              >
                <HomeOutlined sx={{ fontSize: "18px" }} className="mb-0.5" />
              </Link>
              {getBreadcrumbTrail(location.pathname).map((breadcrumb) => {
                let label = breadcrumb.label;

                // Handle dynamic labels for modules and tables
                if (label === "Módulo" && moduleData?.name) {
                  label = `Módulo ${moduleData.name}`;
                }

                if (label === "Tabelas" && tableData?.name) {
                  label = `Tabela ${tableData.name}`;
                }

                return (
                  <Link
                    key={breadcrumb.path}
                    to={breadcrumb.path}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-[--foreground-color] hover:underline"
                  >
                    {label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
          {children}
        </motion.div>
      </div>
      <CompanySelect
        open={companyListOpen}
        onClose={() => setCompanyListOpen(false)}
        companies={availableCompanies}
        onSelect={handleSelectCompany}
        currentCompany={company}
      />
      <Dialog
        open={!!companyToConfirm}
        maxWidth="xs"
        fullWidth
        onClose={() => setCompanyToConfirm(null)}
      >
        <DialogTitle className="flex flex-row gap-2 items-center">
          <WarningRounded />
          <p className="text-lg font-bold">Confirmar alteração</p>
        </DialogTitle>
        <DialogContent className="flex flex-col gap-3">
          <p>
            Deseja alterar a empresa ativa para <b>{companyToConfirm?.name}</b>?
          </p>
          <p className=" dark:text-zinc-400 text-zinc-500 text-sm text-justify">
            Ao confirmar, você será redirecionado de volta para a página inicial
            e perderá alterações não salvas.
          </p>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setCompanyToConfirm(null)}>
            Cancelar
          </Button>
          <Button variant="outlined" onClick={handleConfirmCompanyChange}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Layout;
