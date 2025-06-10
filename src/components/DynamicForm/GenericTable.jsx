import { Edit, RemoveRedEye } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// interface Column {
//   label: string;
//   key: string;
//   align?: "left" | "center" | "right";
//   sortable?: boolean;
//   sortKey?: string;
// }

const GenericTable = ({
  columns = [],
  data = [],
  pagination = {
    total: 0,
    perPage: 10,
    current: 1,
  },
  onRowClick,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
  renderActions,
  isLoading = false,
  emptyRowsMessage = "Nenhum dado encontrado",
  tableName = "",
}) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });

  const [sortedData, setSortedData] = useState(data);

  const handleSort = (key) => {
    const direction =
      sortConfig.direction === "asc" && sortConfig.key === key ? "desc" : "asc";
    const newSortedData = [...sortedData];
    newSortedData.sort((a, b) => {
      const aKey = key.split(".").reduce((acc, part) => acc && acc[part], a);
      const bKey = key.split(".").reduce((acc, part) => acc && acc[part], b);

      if (aKey < bKey) return direction === "asc" ? -1 : 1;
      if (aKey > bKey) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setSortedData(newSortedData);
  };

  const createSortHandler = (key) => () => {
    handleSort(key);
  };

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
      return;
    }
  };

  const onView = (row) => {
    navigate(`/tabelas/${tableName}/${row.id}`, {
      state: {
        recordId: row.id,
        edit: false,
      },
    });
  };

  const onEdit = (row) => {
    navigate(`/tabelas/${tableName}/${row.id}/editar`, {
      state: {
        recordId: row.id,
        edit: true,
      },
    });
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align || "left"}
                sortDirection={
                  sortConfig.key === column.key ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === column.key}
                  direction={sortConfig.direction}
                  onClick={createSortHandler(column.key)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={columns.length + (renderActions ? 1 : 0)}
                rowSpan={2}
                align="center"
              >
                <CircularProgress size={24} />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (renderActions ? 1 : 0)}>
                {emptyRowsMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={(e) => {
                  if (e.target.closest("button")) {
                    return;
                  }
                  handleRowClick(row);
                }}
                style={{ cursor: "pointer" }}
              >
                {columns.map((column) => (
                  <TableCell key={column.key}>{row[column.key]}</TableCell>
                ))}
                <TableCell className="space-x-4">
                  <IconButton onClick={() => onView(row)} key="view">
                    <RemoveRedEye fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onEdit(row)} key="edit">
                    <Edit fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pagination.total}
        labelRowsPerPage="Linhas por página"
        rowsPerPage={pagination.perPage}
        page={pagination.current}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
      />
    </TableContainer>
  );
};

export default GenericTable;
