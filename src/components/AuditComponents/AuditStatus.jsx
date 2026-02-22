import { CheckCircle, Error, WatchLater } from "@mui/icons-material";
import { Chip, CircularProgress, Tooltip } from "@mui/material";

const AuditStatus = ({ status, size = "small", variant = "filled" }) => {
  const colors = {
    success: "success",
    pending: "info",
    failed: "error",
    running: "warning",
    queued: "info",
  };

  const label = {
    success: "Concluído",
    pending: "Pendente",
    failed: "Falhou",
    running: "Em andamento",
    queued: "Em fila",
  };

  const icon = {
    success: <CheckCircle color="success" fontSize="small" />,
    pending: <WatchLater color="info" fontSize="small" />,
    queued: <WatchLater color="info" fontSize="small" />,
    failed: <Error color="error" fontSize="small" />,
    running: <CircularProgress size={16} color="info" />,
  };

  const tooltipText = {
    success: "Auditoria concluída com sucesso.",
    pending: "Auditoria pendente. Aguarde a execução.",
    queued: "Auditoria em fila. Aguarde a execução.",
    failed: "Auditoria falhou. Tente novamente ou contate o suporte.",
    running: "Auditoria em andamento.",
  };

  return (
    <Tooltip title={tooltipText[status]} arrow>
      <Chip
        color={colors[status]}
        label={label[status]}
        icon={icon[status]}
        size={size}
        variant={variant}
      />
    </Tooltip>
  );
};

export default AuditStatus;
