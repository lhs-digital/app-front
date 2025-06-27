import { Delete, Edit, Visibility } from "@mui/icons-material";
import {
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ModuleTable = ({ modules, onView, onEdit, onDelete, isLoading }) => {
  return (
    <div className="w-full border border-[--border] rounded-lg overflow-hidden">
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Módulo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              "& > tr:last-child td, & > tr:last-child th": {
                borderBottom: "none",
              },
            }}
          >
            {modules.length > 0 ? (
              modules.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="w-10/12">{m.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => onView(m.id)}>
                      <Visibility />
                    </IconButton>
                    <IconButton onClick={() => onEdit(m.id)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDelete(m.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <Skeleton variant="text" height={100} />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={2}>Nenhum módulo encontrado</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={modules.length}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={pagination.onPageChange}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
        /> */}
      </TableContainer>
    </div>
  );
};

export default ModuleTable;
