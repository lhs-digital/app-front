import {
  Clear,
  DataArray,
  Delete,
  Edit,
  ExpandMore,
  Search,
  TableChartOutlined,
} from "@mui/icons-material";
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
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

const SORTABLE_COLUMNS = [
  { id: "label", label: "Coluna" },
  { id: "type", label: "Tipo" },
  { id: "rules", label: "Regras" },
  { id: "default", label: "Default" },
];

const comparators = {
  label: (a, b) => (a.label ?? "").localeCompare(b.label ?? ""),
  type: (a, b) => (a.type ?? "").localeCompare(b.type ?? ""),
  rules: (a, b) => (a.rules?.length ?? 0) - (b.rules?.length ?? 0),
  default: (a, b) => (a.default ?? "").localeCompare(b.default ?? ""),
};

const TableAccordion = ({
  table,
  pendingColumns = [],
  onColumnClick,
  onColumnRemove,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("rules");
  const [order, setOrder] = useState("desc");

  const columns = useMemo(() => {
    const serverCols = table.columns ?? [];
    if (pendingColumns.length === 0) return serverCols;

    const pendingMap = new Map(pendingColumns.map((c) => [c.id, c]));
    return serverCols.map((col) => pendingMap.get(col.id) ?? col);
  }, [table.columns, pendingColumns]);

  const totalRules = columns.reduce(
    (sum, col) => sum + (col.rules?.length ?? 0),
    0,
  );

  const pendingRulesTotal = pendingColumns.reduce(
    (sum, col) => sum + (col.rules?.length ?? 0),
    0,
  );

  const filtered = useMemo(() => {
    if (!search) return columns;
    const lower = search.toLowerCase();
    return columns.filter((col) => col.label.toLowerCase().includes(lower));
  }, [columns, search]);

  const sorted = useMemo(() => {
    const compare = comparators[orderBy];
    if (!compare) return filtered;
    const sorted = [...filtered].sort(compare);
    return order === "desc" ? sorted.reverse() : sorted;
  }, [filtered, orderBy, order]);

  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleSort = (columnId) => {
    if (orderBy === columnId) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(columnId);
      setOrder("asc");
    }
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Accordion
      disableGutters
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{
        borderRadius: "8px !important",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-3 flex-1 cursor-pointer"
        >
          <TableChartOutlined fontSize="small" color="primary" />
          <Typography fontWeight={600}>{table.label}</Typography>
          <p className="text-sm text-neutral-500">({columns.length} colunas)</p>
          {totalRules > 0 && (
            <Chip
              label={`${totalRules} regra${totalRules !== 1 ? "s" : ""}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {pendingRulesTotal > 0 && (
            <Chip
              label={`+${pendingRulesTotal} não salva${pendingRulesTotal !== 1 ? "s" : ""}`}
              size="small"
              variant="outlined"
              color="info"
            />
          )}
        </div>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <div className="flex flex-row items-center justify-between gap-2 px-4 py-4 border-t border-[var(--border)]">
          <TextField
            placeholder="Pesquisar colunas por nome..."
            size="small"
            className="grow"
            value={search}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: <Search className="text-neutral-500 mr-2" />,
                endAdornment: search && (
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <Clear fontSize="small" />
                  </IconButton>
                ),
              },
            }}
          />
        </div>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow className="dark:bg-black/30 bg-[var(--faded-border)] border-t dark:border-[var(--border)]">
                {SORTABLE_COLUMNS.map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{
                      fontWeight: 700,
                      ...(col.id === "label" && { width: "50%" }),
                      ...(col.id === "rules" && { textAlign: "center" }),
                    }}
                    sortDirection={orderBy === col.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 700 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((column) => (
                <TableRow
                  key={column.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DataArray fontSize="inherit" color="action" />
                      <Typography variant="body2" fontWeight={500}>
                        {column.label}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={column.type}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <div className="flex items-center justify-center gap-4">
                      {column.rules?.length ?? 0}
                    </div>
                  </TableCell>
                  <TableCell>{column.default ?? "—"}</TableCell>
                  <TableCell>
                    <Tooltip title="Gerenciar regras" placement="top">
                      <IconButton
                        onClick={() => onColumnClick?.(column, table)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover do grupo" placement="top">
                      <IconButton
                        onClick={() => onColumnRemove?.(column.id)}
                        disabled={
                          !pendingColumns.some((c) => c.id === column.id)
                        }
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma coluna encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {filtered.length > 10 && (
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default TableAccordion;
