import { Circle } from "@mui/icons-material";
import { Chip } from "@mui/material";

const VpnStatus = ({ status, size = "small" }) => {
  const colors = {
    active: "success",
    inactive: "info",
    error: "error",
  };

  const label = {
    active: "Ativo",
    inactive: "Inativo",
    error: "Erro",
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

export default VpnStatus;
