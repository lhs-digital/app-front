import {
  HomeOutlined,
  NavigateNext,
  SaveOutlined,
  SwapHoriz,
  WarningAmberOutlined,
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
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
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
  const [confirmChangeOpen, setConfirmChangeOpen] = useState(false);
  const theme = handleMode(useThemeMode().mode);
  const location = useLocation();
  const [editingCompany, setEditingCompany] = useState(false);
  const pathnames = location.pathname.split("/").filter(Boolean);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!company) {
      navigate("/painel");
      setEditingCompany(false);
    }
  }, [company]);

  const onCompanyChangeClick = () => {
    if (!editingCompany) {
      setEditingCompany(true);
      return;
    }

    setCompany(selectedCompany);
    setEditingCompany(false);
    navigate("/painel");
  };

  const onConfirmChange = () => {
    setConfirmChangeOpen(false);
    setEditingCompany(true);
  };

  const promptCompanyChange = () => {
    setConfirmChangeOpen(true);
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
              <IconButton
                onClick={
                  editingCompany ? onCompanyChangeClick : promptCompanyChange
                }
              >
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
        <motion.div
          className="max-h-[calc(100vh-4rem)] px-8 pb-8 pt-4 overflow-y-scroll space-y-6"
          style={{
            width: sidebarOpen ? "calc(100vw - 320px)" : "calc(100vw - 65px)",
            transition: "all 0.3s ease-in-out",
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
          {editingCompany ? (
            <div className="flex flex-col gap-4 items-center justify-center h-[calc(100vh-4rem)]">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selecione uma empresa para continuar
              </p>
            </div>
          ) : (
            children
          )}
        </motion.div>
      </div>
      <Dialog
        open={confirmChangeOpen}
        maxWidth="xs"
        fullWidth
        onClose={() => setConfirmChangeOpen(false)}
      >
        <DialogTitle className="flex flex-row gap-2 items-center">
          <WarningAmberOutlined fontSize="small" />
          <p className="text-lg font-bold">Alterar empresa</p>
        </DialogTitle>
        <DialogContent>
          <p className="text-justify">
            <b>Tem certeza que deseja alterar a empresa?</b> Você será
            redirecionado para a página inicial e poderá perder alterações não
            salvas.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setConfirmChangeOpen(false)}
          >
            Cancelar
          </Button>
          <Button variant="outlined" onClick={onConfirmChange}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Layout;
