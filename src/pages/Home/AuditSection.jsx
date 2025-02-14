import {
  Build,
  Description,
  Person,
  RuleFolder,
  Work,
} from "@mui/icons-material";
import { Box, Button, Card, colors } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalReport from "../../components/ModalReport";
import { AuthContext } from "../../contexts/auth";

const AuditSection = ({ completionData, priorityData, stats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { permissions } = useContext(AuthContext);

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
      fn: () => navigate("/audits"),
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
    return permissions.some((permission) =>
      thePermissions.includes(permission.name),
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
          {
            permissions.some((per) => per.name === "report_generate") && (
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
            )
          }
          {
            permissions.some((per) => per.name === "define_rules") && (
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
            )
          }
          <Card
            className="p-4 flex flex-col gap-2 justify-center"
            variant="outlined"
          >
            <p>Entidades auditadas</p>
            <p className="text-lg lg:text-2xl font-bold">
              {stats.audittedEntities}
            </p>
          </Card>
          <Card
            className="p-4 flex flex-col gap-2 justify-center"
            variant="outlined"
          >
            <p>Última auditoria</p>
            <p className="text-xl font-bold">{stats.latestAudit}</p>
          </Card>
          <Card variant="outlined" className="max-md:hidden col-span-2 p-4 flex flex-col gap-2 grow justify-between">
            <p>Acesso rápido</p>
            <Box display="flex" gap={4}>
              {quickActions.map((action, index) => (
                action.permissions ? (
                  hasPermission(action.permissions) && (
                    <div className="text-center w-min flex flex-col items-center gap-2" key={index}>
                      <button
                        className="p-3 w-fit aspect-square rounded-full flex flex-col items-center justify-center outline outline-transparent hover:outline-3 transition-all hover:outline-gray-500/25"
                        style={{ backgroundColor: colors.grey[900], color: colors.grey[50] }}
                        onClick={action.fn}
                      >
                        {action.icon}
                      </button>
                      <label className="text-xs text-gray-500">{action.label}</label>
                    </div>
                  )
                ) : (
                  <div className="text-center w-min flex flex-col items-center gap-2" key={index}>
                    <button
                      className="p-3 w-fit aspect-square rounded-full flex flex-col items-center justify-center outline outline-transparent hover:outline-3 transition-all hover:outline-gray-500/25"
                      style={{ backgroundColor: colors.grey[900], color: colors.grey[50] }}
                      onClick={action.fn}
                    >
                      {action.icon}
                    </button>
                    <label className="text-xs text-gray-500">{action.label}</label>
                  </div>
                )
              ))}
            </Box>
          </Card>
        </Box>
        <Card
          variant="outlined"
          className="max-md:hidden p-4 flex flex-col gap-2 grow"
        >
          <p>Atividades por status</p>
          <PieChart
            colors={[colors.grey[900], colors.grey[600]]}
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
        </Card>
        <Card
          variant="outlined"
          className="max-md:hidden p-4 flex flex-col gap-2 grow"
        >
          <p>Atividades por prioridade</p>
          <PieChart
            series={[
              {
                data: priorityData,
                innerRadius: 50,
              },
            ]}
            colors={[colors.grey[400], colors.grey[600], colors.grey[900]]}
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
      </Box>
      <ModalReport isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
};

export default AuditSection;
