import {
  Button,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const AuditFilters = ({
  open,
  anchorEl,
  onClose,
  filters,
  onFilterChange,
  onApplyFilters,
  onCleanFilters,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        style: {
          width: "400px",
          padding: "16px",
        },
      }}
      title="Filtros"
    >
      <div className="flex flex-col gap-4">
        <div>
          <InputLabel>Data da Auditoria</InputLabel>
          <div className="flex gap-2 items-center">
            <TextField
              type="date"
              fullWidth
              size="small"
              value={filters.createdAt[0] || ""}
              onChange={(e) =>
                onFilterChange("createdAt", [
                  e.target.value,
                  filters.createdAt[1],
                ])
              }
            />
            até
            <TextField
              type="date"
              fullWidth
              size="small"
              value={filters.createdAt[1] || ""}
              onChange={(e) =>
                onFilterChange("createdAt", [
                  filters.createdAt[0],
                  e.target.value,
                ])
              }
            />
          </div>
        </div>
        <div>
          <InputLabel>Ordem de Prioridade</InputLabel>
          <Select
            value={filters.priorityOrder}
            onChange={(e) => onFilterChange("priorityOrder", e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="desc">Decrescente</MenuItem>
            <MenuItem value="asc">Crescente</MenuItem>
          </Select>
        </div>

        <div>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value={-1}>Todos</MenuItem>
            <MenuItem value={0}>Pendentes</MenuItem>
            <MenuItem value={1}>Concluídas</MenuItem>
          </Select>
        </div>

        <div>
          <InputLabel>Prioridade</InputLabel>
          <Select
            value={filters.priority}
            onChange={(e) => onFilterChange("priority", e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value={-1}>Todas</MenuItem>
            <MenuItem value={3}>Urgente</MenuItem>
            <MenuItem value={2}>Moderada</MenuItem>
            <MenuItem value={1}>Baixa</MenuItem>
          </Select>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button onClick={onCleanFilters}>Limpar</Button>
          <Button
            variant="outlined"
            onClick={() => {
              onApplyFilters();
              onClose();
            }}
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </Menu>
  );
};

export default AuditFilters;
