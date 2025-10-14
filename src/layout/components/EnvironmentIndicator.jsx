import { Chip } from "@mui/material";
import { envMap } from "../../services/utils";

const EnvironmentIndicator = () => {
  const environment = import.meta.env.VITE_ENVIRONMENT;
  if (!environment) return null;

  return (
    <Chip
      label={envMap[environment]?.label}
      icon={envMap[environment]?.icon}
      variant="outlined"
    />
  );
};

export default EnvironmentIndicator;
