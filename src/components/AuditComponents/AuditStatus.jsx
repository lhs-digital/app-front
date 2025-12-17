import { Circle } from "@mui/icons-material";
import { Chip } from "@mui/material";

const AuditStatus = ({ status, size = "small" }) => {
  const colors = {
    running: "success",
    completed: "info",
    failed: "error",
  };

  const label = {
    running: "Em andamento",
    completed: "Concluído",
    failed: "Falhou",
  };

  const icon = {
    active: <Circle color="success" />,
    inactive: <Circle color="info" />,
    error: <Circle color="error" />,
  };
  return (
    <Chip
      color={colors[status]}
      label={label[status]}
      icon={icon[status]}
      size={size}
    />
  );
};

export default AuditStatus;
