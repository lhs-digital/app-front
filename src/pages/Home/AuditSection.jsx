import {
  Build,
  Description,
  Person,
  RuleFolder,
  Work,
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
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalReport from "../../components/ModalReport";
import { useThemeMode } from "../../contexts/themeModeContext";
import { useCompany } from "../../hooks/useCompany";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";
import { dateFormatted, formatInterval } from "../../services/utils";
import { handleMode } from "../../theme";

const AuditSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { permissions } = useUserState().state;
  const theme = handleMode(useThemeMode().mode);
  const user = useAuthUser();
  const [data, setData] = useState([]);
  const [dataLastAudit, setDataLastAudit] = useState([]);
  const { company, setCompany, availableCompanies } = useCompany();
  const [updateInterval, setUpdateInterval] = useState(600);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [chartData, setChartData] = useState({
    errorsCount: 0,
    fixedErrorsCount: 0,
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleIntervalChange = (event) => {
    setUpdateInterval(event.target.value);
    setIsConfirmModalOpen(true);
  };

  const confirmIntervalChange = async () => {
    try {
      await api.put(`/company/${company?.id}/update_interval`, {
        audit_interval: updateInterval,
      });
      setIsConfirmModalOpen(false);
      toast.success(
        `Intervalo de auditoria atualizado para ${formatInterval(updateInterval)} com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao atualizar o intervalo de auditoria", error);
      toast.error("Erro ao atualizar o intervalo de auditoria");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/audit/summary`);
        const data = response?.data?.data;

        if (Array.isArray(data) && data.length > 0) {
          setData(data);
          setDataLastAudit(data[0].last_audit_date);

          // Verifique se audit_interval existe antes de atualizar o estado
          if (data[0].audit_interval !== undefined) {
            setUpdateInterval(data[0].audit_interval);
          } else {
            console.warn("audit_interval não encontrado, usando valor padrão");
            setUpdateInterval(600); // Valor padrão
          }
        } else {
          console.error("A resposta não é um array:", data);
          setData([]);
        }
      } catch (error) {
        console.error("Erro ao verificar lista de usuários", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const selectedCompany = data.find(
        (item) => item.company.id === company?.id,
      );
      const tables = selectedCompany ? selectedCompany.per_tables : [];
      const selectedTable = tables.find(
        (table) => table.label === selectedTableId,
      );

      if (selectedTable) {
        setUpdateInterval(data[0]?.audit_interval);
        setChartData({
          errorsCount: selectedTable.errors_count,
          fixedErrorsCount: selectedTable.fixed_errors_count,
        });
      }
    }
  }, [data, company?.id, selectedTableId]);

  const selectedCompany = data?.find((item) => item.company.id === company?.id);
  const tables = selectedCompany ? selectedCompany.per_tables : [];

  const handleTableChange = (event) => {
    const tableId = event.target.value;
    setSelectedTableId(tableId);
    const selectedTable = tables?.find((table) => table.label === tableId);

    if (selectedTable) {
      setChartData({
        errorsCount: selectedTable.errors_count,
        fixedErrorsCount: selectedTable.fixed_errors_count,
      });
    }
  };

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    setSelectedTableId(null);
    setChartData({ errorsCount: 0, fixedErrorsCount: 0 });
  };

  const completionData = [
    { id: 0, value: chartData?.errorsCount, label: "Pendentes" },
    { id: 1, value: chartData?.fixedErrorsCount, label: "Corrigidos" },
  ];

  const stats = {
    audittedEntities: chartData?.errorsCount + chartData?.fixedErrorsCount,
    latestAudit: new Date(Date.now()).toLocaleDateString("pt-BR"),
  };

  const usersPermissions = [
    "view_users",
    "view_any_users",
    "update_users",
    "delete_users",
  ];
  //eslint-disable-next-line
  const auditoriaPermissions = ["view_any_tasks", "update_tasks"];

  const quickActions = [
    {
      icon: <Build fontSize="small" />,
      fn: () => navigate("/auditorias"),
      label: "Atividades",
      permissions: auditoriaPermissions,
    },
    {
      icon: <Work fontSize="small" />,
      fn: () => navigate("/clientes"),
      label: "Clientes",
    },
    {
      icon: <Person fontSize="small" />,
      fn: () => navigate("/users"),
      label: "Usuários",
      permissions: usersPermissions,
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
          gridTemplateColumns={{ xs: "1fr", lg: "1fr 1fr" }}
        >
          <Card
            className="p-4 flex flex-col gap-2 justify-center"
            variant="outlined"
          >
            <FormControl fullWidth>
              <InputLabel id="company">Empresa</InputLabel>
              <Select
                value={company?.id || ""}
                onChange={handleCompanyChange}
                label="Empresa"
                disabled={!user.isLighthouse}
              >
                {user.isLighthouse ? (
                  availableCompanies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={user.company.id}>
                    {user.company.name}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Card>

          <Card
            className="p-4 flex flex-col gap-2 justify-center"
            variant="outlined"
          >
            <FormControl fullWidth>
              <InputLabel id="company">Tabela</InputLabel>
              <Select
                value={selectedTableId || ""}
                onChange={handleTableChange}
                label="Tabela"
              >
                {tables && tables.length > 0 ? (
                  tables.map((table) => (
                    <MenuItem key={table.label} value={table.label}>
                      {table.label}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Nenhuma tabela disponível</MenuItem>
                )}
              </Select>
            </FormControl>
          </Card>
          {selectedTableId && (
            <Card
              className="p-4 flex flex-col gap-2 justify-center"
              variant="outlined"
            >
              <FormControl fullWidth>
                <InputLabel id="interval">Intervalo de auditoria</InputLabel>
                <Select
                  value={updateInterval || ""}
                  onChange={handleIntervalChange}
                  label="Intervalo de auditoria"
                >
                  <MenuItem value={600}>10 minutos</MenuItem>
                  <MenuItem value={1800}>30 minutos</MenuItem>
                  <MenuItem value={3600}>1 hora</MenuItem>
                  <MenuItem value={21600}>6 horas</MenuItem>
                  <MenuItem value={43200}>12 horas</MenuItem>
                  <MenuItem value={86400}>1 dia</MenuItem>
                  <MenuItem value={604800}>1 semana</MenuItem>
                  <MenuItem value={2592000}>1 mês</MenuItem>
                  <MenuItem value={31536000}>1 ano</MenuItem>
                </Select>
              </FormControl>
            </Card>
          )}
          {selectedTableId && (
            <Dialog
              open={isConfirmModalOpen}
              onClose={() => setIsConfirmModalOpen(false)}
              aria-labelledby="confirm-dialog-title"
              aria-describedby="confirm-dialog-description"
            >
              <DialogTitle id="confirm-dialog-title">
                Confirmar Alteração
              </DialogTitle>
              <DialogContent>
                <p>
                  Deseja confirmar a alteração do intervalo de auditoria para
                  <strong> {formatInterval(updateInterval)}?</strong>
                </p>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setIsConfirmModalOpen(false)}
                  color="error"
                >
                  Cancelar
                </Button>
                <Button onClick={confirmIntervalChange} color="primary">
                  Confirmar
                </Button>
              </DialogActions>
            </Dialog>
          )}
          {selectedTableId && (
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
          {selectedTableId && (
            <Card
              className="p-4 flex flex-col gap-2 justify-center"
              variant="outlined"
            >
              <p>Entidades auditadas</p>
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
              <p>Relatório disponível</p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsOpen(true)}
                startIcon={<Description />}
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
              <p>Regras de auditoria</p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/prioridades")}
                startIcon={<RuleFolder />}
              >
                VISUALIZAR
              </Button>
            </Card>
          )}
          <Card
            variant="outlined"
            className="max-md:hidden col-span-2 p-4 flex flex-col gap-2 grow justify-between"
          >
            <p>Acesso rápido</p>
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
        <Card
          variant="outlined"
          className="max-md:hidden p-4 flex flex-col gap-2 grow"
        >
          <p>Atividades por status</p>
          {!selectedTableId ? (
            <div className="flex flex-col justify-center items-center margin-auto h-full w-full">
              <p className="text-gray-500">Não há dados para exibir...</p>
              <p className="text-gray-500">
                Selecione uma empresa e uma tabela
              </p>
            </div>
          ) : (
            <PieChart
              colors={[grey[900], grey[600]]}
              series={[
                {
                  data: completionData,
                  innerRadius: 50,
                },
              ]}
              slotProps={{
                legend: {
                  direction: "column",
                  position: { vertical: "middle", horizontal: "right" },
                  padding: 0,
                },
              }}
              height={200}
            />
          )}
        </Card>
        {/* {
          !selectedTableId ? (
            null
          ) : (
            <Card
              variant="outlined"
              className="max-md:hidden p-4 flex flex-col gap-2 grow"
            >
              <p>Atividades por prioridade</p>
              <PieChart
                colors={[grey[400], grey[600], grey[900]]}
                series={[{
                  data: priorityData,
                  innerRadius: 50,
                }]}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    padding: 0,
                  },
                }}
                height={200}
              />
            </Card>
          )
        } */}
      </Box>
      <ModalReport isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
};

export default AuditSection;
