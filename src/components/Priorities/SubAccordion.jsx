import { Delete, Edit, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";

const SubAccordion = ({ column, data, handleEdit, handleDelete }) => {

  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Accordion key={column.id}>
      <AccordionSummary
        id={column.id}
        aria-controls={`${column.id}-content`}
        expandIcon={<ExpandMore />}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          Coluna: {column.label}
          <div style={{ display: "flex", gap: "12px" }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(column);
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(column.id);
              }}
            >
              <Delete />
            </IconButton>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell maxW={isMobile ? 5 : 100} fontSize="16px">
                Nome
              </TableCell>
              <TableCell maxW={isMobile ? 5 : 100} fontSize="16px">
                Parâmetros
              </TableCell>
              <TableCell maxW={isMobile ? 5 : 100} fontSize="16px">
                Mensagem
              </TableCell>
              <TableCell p={0} />
              <TableCell p={0} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} textAlign="center">
                  Não existem Regras de Auditorias no sistema
                </TableCell>
              </TableRow>
            ) : (
              column.validations &&
              column.validations.map((validation) => (
                <TableRow
                  key={validation.id}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                >
                  <TableCell maxW={isMobile ? 5 : 100}>
                    {validation.rule.label}
                  </TableCell>
                  <TableCell maxW={isMobile ? 5 : 100}>
                    {validation.rule.has_params}
                  </TableCell>
                  <TableCell maxW={isMobile ? 5 : 100}>
                    {validation.message || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
};

export default SubAccordion;
