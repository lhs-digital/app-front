import {
  Box,
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
import { toast } from "react-toastify";
import { useThemeMode } from "../../../../contexts/themeModeContext";
import api from "../../../../services/api";
import {
  formattedPriority,
  getPriorityColor,
} from "../../../../services/utils";
import { handleMode } from "../../../../theme";

const ViewAuditItem = ({ id, selectedActivitie }) => {
  const { mode: themeMode } = useThemeMode();
  const theme = handleMode(themeMode);
  //eslint-disable-next-line
  const formattedDate = (date) => new Date(date).toLocaleDateString("pt-BR");

  //eslint-disable-next-line
  const handleConfirm = async () => {
    try {
      await api.put(`/auditing/${id}/toggle_status`);
      toast.success("Status da atividade alterado com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar o status da atividade", error);
    }
  };

  return (
    <Box gap="12px" flexDirection="column" display="flex">
      <TableContainer>
        <Table variant="striped" size="small" width="100%">
          <TableHead>
            <TableRow>
              <TableCell>Campo</TableCell>
              <TableCell>Valor observado</TableCell>
              <TableCell>Prioridade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedActivitie?.columns.map((col, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography fontWeight="bold">{col?.label}</Typography>
                </TableCell>
                <TableCell>{col?.value || "N/A"}</TableCell>
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
    </Box>
  );
};

export default ViewAuditItem;
