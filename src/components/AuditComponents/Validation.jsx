import { Chip, Tooltip } from "@mui/material";
import { useThemeMode } from "../../contexts/themeModeContext";
import {
  formatRuleLabel,
  formattedPriority,
  getPriorityColor,
} from "../../services/utils";
import { handleMode } from "../../theme";

const Validation = ({ rule, onDelete }) => {
  const { mode: themeMode } = useThemeMode();
  const theme = handleMode(themeMode);
  const colors = getPriorityColor(rule.priority, theme);

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
        label={formatRuleLabel(rule)}
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
