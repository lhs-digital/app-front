import {
  Assignment,
  AssignmentLate,
  BoltOutlined,
  Build,
  BusinessCenter,
  CheckCircleOutline,
  DescriptionOutlined,
  WidgetsOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import { amber } from "@mui/material/colors";
import { PieChart } from "@mui/x-charts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalReport from "../../../../components/ModalReport";
import { useThemeMode } from "../../../../contexts/themeModeContext";
import { useCompany } from "../../../../hooks/useCompany";
import { useUserState } from "../../../../hooks/useUserState";
import api from "../../../../services/api";
import { dateFormatted, formatInterval } from "../../../../services/utils";
import { handleMode } from "../../../../theme";

const AuditSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { permissions } = useUserState().state;
  const theme = handleMode(useThemeMode().mode);
  const [dataLastAudit, setDataLastAudit] = useState([]);
  const { company } = useCompany();
  const [auditModule, setAuditModule] = useState(null);
  const [chartData, setChartData] = useState({
    errorsCount: 0,
    fixedErrorsCount: 0,
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (!auditModule) return;
    const fetchData = async () => {
      const response = await api.get(`/companies/${company?.id}/audit/summary`);

      if (response.data.per_module && auditModule) {
        const foundModule = response.data.per_module.find(
          (mod) => mod.label === auditModule.name,
        );
        if (foundModule) {
          setChartData({
            errorsCount: foundModule.errors_count,
            fixedErrorsCount: foundModule.fixed_errors_count,
          });
        }
      }

      setDataLastAudit(response.data.last_audit_date);
    };
    fetchData();
  }, [auditModule]);

  const { data: availableModules = [] } = useQuery({
    queryKey: ["company_tables", company],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/audit/modules`);
      return response.data.data;
    },
    enabled: !!company,
  });

  const completionData = [
    {
      id: 0,
      value: chartData?.errorsCount,
      label: "Pendentes",
    },
    {
      id: 1,
      value: chartData?.fixedErrorsCount,
      label: "Corrigidos",
    },
  ];

  const stats = {
    audittedEntities: chartData?.errorsCount + chartData?.fixedErrorsCount,
    latestAudit: new Date(Date.now()).toLocaleDateString("pt-BR"),
  };

  //eslint-disable-next-line
  const auditoriaPermissions = ["view_any_tasks", "update_tasks"];
  const workOrderPermissions = ["view_any_work_orders", "view_work_orders"];
  const clientPermissions = ["view_clients", "view_any_clients"];

  const quickActions = [
    {
      icon: <AssignmentLate fontSize="small" />,
      fn: () => navigate("/auditorias"),
      label: "Auditoria",
      permissions: auditoriaPermissions,
    },
    {
      icon: <Assignment fontSize="small" />,
      fn: () => navigate("/ordens-de-servico"),
      label: "O.S.",
      permissions: workOrderPermissions,
    },
    {
      icon: <BusinessCenter fontSize="small" />,
      fn: () => navigate("/empresas"),
      label: "Empresas",
      permissions: clientPermissions,
    },
  ];

  const hasPermission = (thePermissions) => {
    return (
      permissions &&
      permissions.some((permission) => thePermissions.includes(permission.name))
    );
  };

  return (
    <Box display="flex" gap={2} flexDirection="column">
      <div className="flex flex-row gap-2 items-center">
        <Build fontSize="small" />
        <h2 className="font-medium">Auditoria</h2>
      </div>
      <Box
        display="flex"
        gap={2}
        flexDirection={{ xs: "column", lg: "row" }}
        className="grow"
      >
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={isMobile ? "1fr" : "1fr 1fr"}
        >
          <Card
            className={`p-4 flex flex-col gap-2 justify-center ${isMobile ? "" : "col-span-2"}`}
            variant="outlined"
          >
            <FormControl fullWidth>
              <InputLabel id="table-select">Módulo</InputLabel>
              <Select
                fullWidth
                labelId="table-select"
                className="capitalize"
                value={auditModule}
                label="Módulo"
                onChange={(e) => setAuditModule(e.target.value)}
              >
                {availableModules.map((module) => (
                  <MenuItem
                    key={module.id}
                    value={module}
                    className="capitalize"
                  >
                    {module.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
          {auditModule && (
            <Card
              className="p-4 flex flex-col gap-2 justify-center"
              variant="outlined"
            >
              <p>Última auditoria</p>
              <p className="text-xl font-bold">
                {dateFormatted(dataLastAudit)}
              </p>
            </Card>
          )}
          {auditModule && (
            <Card
              className="p-4 flex flex-col gap-2 justify-center"
              variant="outlined"
            >
              <p>
                <span>
                  <CheckCircleOutline fontSize="small" className="mb-0.5" />
                </span>{" "}
                Entidades auditadas
              </p>
              <p className="text-lg lg:text-2xl font-bold">
                {stats.audittedEntities}
              </p>
            </Card>
          )}
          {hasPermission(["report_generate"]) && (
            <Card
              className="p-4 flex flex-col gap-2 justify-center"
              variant="outlined"
            >
              <p>
                <span>
                  <DescriptionOutlined fontSize="small" className="mb-1" />
                </span>{" "}
                Relatório disponível
              </p>
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setIsOpen(true)
                }
              >
                GERAR RELATÓRIO
              </Button>
            </Card>
          )}
          {hasPermission(["define_rules"]) && (
            <Card
              className="p-4 flex flex-col gap-2 justify-center"
              variant="outlined"
            >
              <p>
                <span>
                  <WidgetsOutlined fontSize="small" className="mb-1" />
                </span>{" "}
                Gerir módulos
              </p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/modulos")}
              >
                VISUALIZAR
              </Button>
            </Card>
          )}
          <Card
            variant="outlined"
            className="max-md:hidden col-span-2 p-4 flex flex-col gap-2 grow justify-between"
          >
            <p className="mb-1">
              <span>
                <BoltOutlined fontSize="small" className="mb-1" />
              </span>{" "}
              Acesso rápido
            </p>
            <Box display="flex" gap={4}>
              {quickActions.map((action, index) =>
                action.permissions ? (
                  hasPermission(action.permissions) && (
                    <div
                      className="text-center w-min flex flex-col items-center gap-2"
                      key={index}
                    >
                      <button
                        className="p-3 w-fit aspect-square rounded-full flex flex-col items-center justify-center outline outline-transparent hover:outline-3 transition-all hover:outline-gray-500/25"
                        style={{
                          backgroundColor:
                            theme === "light" ? colors.grey[900] : "#fff",
                          color: colors.grey[theme === "light" ? 50 : 900],
                        }}
                        onClick={action.fn}
                      >
                        {action.icon}
                      </button>
                      <label className="text-xs text-gray-500 dark:text-[--foreground-color]">
                        {action.label}
                      </label>
                    </div>
                  )
                ) : (
                  <div
                    className="text-center w-min flex flex-col items-center gap-2"
                    key={index}
                  >
                    <button
                      className="p-3 w-fit aspect-square rounded-full flex flex-col items-center justify-center outline outline-transparent hover:outline-3 transition-all hover:outline-gray-500/25"
                      style={{
                        backgroundColor:
                          theme === "light" ? colors.grey[900] : "#fff",
                        color: colors.grey[theme === "light" ? 50 : 900],
                      }}
                      onClick={action.fn}
                    >
                      {action.icon}
                    </button>
                    <label className="text-xs text-gray-500 dark:text-[--foreground-color]">
                      {action.label}
                    </label>
                  </div>
                ),
              )}
            </Box>
          </Card>
        </Box>
        {/* Quick Actions for desktop */}
        <Card
          variant="outlined"
          className={`p-4 flex flex-col gap-2 grow ${isMobile ? "w-full" : "max-md:hidden"}`}
        >
          <p>Atividades por status</p>
          {!auditModule ? (
            <div className="flex flex-col justify-center items-center margin-auto h-full w-full">
              <p className="text-gray-500">Não há dados para exibir...</p>
              <p className="text-gray-500">
                Selecione uma empresa e uma tabela
              </p>
            </div>
          ) : (
            <PieChart
              colors={
                theme === "light" ? [amber[600], "#000"] : [amber[400], "#fff"]
              }
              series={[
                {
                  data: completionData,
                  paddingAngle: 2.5,
                  innerRadius: isMobile ? 40 : 100,
                },
              ]}
              slotProps={{
                legend: {
                  direction: "column",
                  position: isMobile
                    ? { vertical: "bottom", horizontal: "middle" }
                    : { vertical: "bottom", horizontal: "right" },
                  padding: 0,
                },
              }}
              width={isMobile ? 300 : undefined}
              height={isMobile ? 360 : 400}
            />
          )}
        </Card>
        {/* ... priority PieChart (commented out) ... */}
      </Box>
      <ModalReport isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
};

export default AuditSection;
