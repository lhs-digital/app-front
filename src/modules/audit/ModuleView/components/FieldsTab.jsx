import { Delete, Edit } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Validation from "../../../../components/AuditComponents/Validation";
import { useThemeMode } from "../../../../contexts/themeModeContext";
import { getPriorityColor, severityLabels } from "../../../../services/utils";
import { useModuleForm } from "../index";

const FieldsTab = () => {
  const theme = useThemeMode();
  const { activeModule } = useModuleForm();

  const renderPriority = (priority) => {
    const { backgroundColor, color } = getPriorityColor(priority, theme);
    const label = severityLabels[priority];
    return (
      <Chip
        label={label}
        style={{ backgroundColor, color }}
        className="text-xs"
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: `${backgroundColor} !important`,
          color: `${color} !important`,
          "&.MuiChip-outlined": {
            borderColor: `${backgroundColor} !important`,
          },
        }}
      />
    );
  };

  return (
    <div className="flex flex-col w-full gap-8">
      {activeModule?.tables.map((table) => (
        <Accordion key={table.id}>
          <AccordionSummary>{table.table}</AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Coluna</TableCell>
                    <TableCell>Regras</TableCell>
                    <TableCell>Prioridade</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.rules.map((column) => (
                    <TableRow key={column.id}>
                      <TableCell>{column.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-row gap-2">
                          {column.validations.map((v) => (
                            <Validation
                              key={`${v.id}-${column.name}`}
                              rule={v.rule}
                              params={v.params}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{renderPriority(column.priority)}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            console.log(column);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default FieldsTab;
