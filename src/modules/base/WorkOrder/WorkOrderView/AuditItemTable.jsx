import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useThemeMode } from "../../../../contexts/themeModeContext";
import {
  dateFormatted,
  formattedPriority,
  getPriorityColor,
  formatParams,
} from "../../../../services/utils";
import { handleMode } from "../../../../theme";

const AuditItemTable = ({ item }) => {
  const theme = handleMode(useThemeMode().mode);
  if (!item || !item?.columns || item.columns.length === 0) {
    return (
      <div className="p-4 text-center text-zinc-500">
        Nenhum dado de auditoria disponível
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between p-4 border border-[--border] rounded-md">
        <div className="flex items-center gap-2">
          <p className="text-sm">Tabela</p>
          <p className="font-bold">{item?.table?.label}</p>
        </div>
        <p className="text-sm">
          Auditado em {dateFormatted(item?.created_at)}
        </p>
      </div>
      <TableContainer>
        <Table variant="striped" size="small" width="100%">
          <TableHead>
            <TableRow>
              <TableCell>Campo</TableCell>
              <TableCell>Valor observado</TableCell>
              <TableCell>Regra infringida</TableCell>
              <TableCell>Prioridade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {item.columns.map((col, index) => (
              <TableRow key={`${col?.value}-${index}`}>
                <TableCell>
                  <Typography fontWeight="bold">{col?.label}</Typography>
                </TableCell>
                <TableCell>{col?.value || "N/A"}</TableCell>
                <TableCell>{`${col?.rule.label} ${formatParams(col?.rule)}`}</TableCell>
                <TableCell>
                  <Tooltip
                    title={`Prioridade: ${formattedPriority(+col?.priority)}`}
                    aria-label="Prioridade"
                  >
                    <Chip
                      variant={theme === "dark" ? "outlined" : "filled"}
                      label={formattedPriority(+col?.priority)}
                      sx={getPriorityColor(col?.priority, theme)}
                      style={{}}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AuditItemTable;
