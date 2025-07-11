import { Chip, Tooltip } from "@mui/material";
import { useThemeMode } from "../../contexts/themeModeContext";
import {
  formattedPriority,
  getPriorityColor,
  validationLabels,
} from "../../services/utils";
import { handleMode } from "../../theme";

const Validation = ({ rule, params, onDelete }) => {
  const { mode: themeMode } = useThemeMode();
  const theme = handleMode(themeMode);
  const colors = getPriorityColor(rule.priority, theme);
  const formatParams = () => {
    if (!params) return null;
    if (Array.isArray(params)) {
      console.log("params is array");
      return params.map((param) => param.trim()).join(", ");
    }
    if (typeof params === "string") {
      return params
        .split(",")
        .map((param) => param.trim())
        .join(", ");
    }
    return params;
  };

  const handleLabel = () => {
    if (!rule) return null;
    let paramsStr = formatParams();
    if (paramsStr) {
      return `${validationLabels[rule.name]} [${paramsStr}]`;
    }
    return validationLabels[rule.name];
  };

  return (
    <Tooltip
      placement="top"
      arrow
      title={
        <div className="flex flex-col gap-1">
          <p>
            Mensagem de erro:{" "}
            <span className="font-bold">
              {rule.message || "(Sem mensagem de erro)"}
            </span>
          </p>
          <p>
            Prioridade:{" "}
            <span className="font-bold">
              {formattedPriority(rule.priority)}
            </span>
          </p>
        </div>
      }
    >
      <Chip
        label={handleLabel()}
        onDelete={onDelete}
        clickable
        variant={theme === "dark" ? "outlined" : "filled"}
        color={colors.muiColor}
        sx={{
          color: colors.color,
          [theme === "dark" ? "borderColor" : "backgroundColor"]:
            colors.backgroundColor,
        }}
      />
    </Tooltip>
  );
};

export default Validation;
