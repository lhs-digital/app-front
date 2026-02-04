import { CheckCircle, Error, Pending } from "@mui/icons-material";
import { Chip } from "@mui/material";

const AuditStatus = ({ status, size = "small" }) => {
  const colors = {
    success: "success",
    pending: "info",
    failed: "error",
  };

  const label = {
    success: "Concluído",
    pending: "Pendente",
    failed: "Falhou",
  };

  const icon = {
    success: <CheckCircle color="success" fontSize="small" />,
    pending: <Pending color="info" fontSize="small" />,
    failed: <Error color="error" fontSize="small" />,
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
