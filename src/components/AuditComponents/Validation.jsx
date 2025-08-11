import { Chip, Tooltip } from "@mui/material";
import { useThemeMode } from "../../contexts/themeModeContext";
import { formattedPriority, getPriorityColor } from "../../services/utils";
import { handleMode } from "../../theme";

const Validation = ({ rule, onDelete }) => {
  const { mode: themeMode } = useThemeMode();
  const theme = handleMode(themeMode);
  const colors = getPriorityColor(rule.priority, theme);
  const formatParams = () => {
    if (!rule.params) return null;
    if (Array.isArray(rule.params)) {
      return rule.params.map((param) => param.trim()).join(", ");
    }
    if (typeof rule.params === "string") {
      return rule.params
        .split(rule.validation.separator || ",")
        .map((param) => param.trim())
        .join(", ");
    }
    return rule.params;
  };

  const handleLabel = () => {
    if (!rule) return null;
    let paramsStr = formatParams();
    if (paramsStr) {
      return `${rule.validation.label} ${rule.validation.multiple ? `[${paramsStr}]` : `${paramsStr}`}`;
    }
    return rule.validation.label;
  };

  return (
    <Tooltip
      placement="top"
      arrow
      title={
        <div className="flex flex-col gap-1 text-sm">
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
