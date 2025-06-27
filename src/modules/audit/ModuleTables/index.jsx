import { Remove, TableChart } from "@mui/icons-material";
import { Button, Chip, Divider } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import TableColumn from "../../../components/AuditComponents/TableColumn";
import PageTitle from "../../../layout/components/PageTitle";
import AddColumn from "./components/AddColumn";

const ModuleTableView = () => {
  const { table } = useLocation().state;
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(null);
  const [columns, setColumns] = useState([]);

  const handleAddColumn = (column) => {
    console.log(column);
    setColumns([...columns, column]);
    setOpenDialog(false);
  };

  const handleRemoveColumn = (column) => {
    setColumns(columns.filter((c) => c.name !== column.name));
  };

  const openEditColumn = (column) => {
    setPendingColumn({
      ...column,
      edit: true,
    });
    setOpenDialog(true);
  };

  const handleEditColumn = (column) => {
    setColumns(columns.map((c) => (c.name === column.name ? column : c)));
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPendingColumn(null);
  };
  return (
    <div className="flex flex-col gap-8 w-full">
      <PageTitle
        title="Tabela"
        icon={<TableChart />}
        subtitle="Tabela do módulo"
      />
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Colunas adicionadas</h2>
          <p className="text-sm text-neutral-500">
            Clique para editar ou remover uma coluna
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 flex-wrap px-2 py-4 border border-[--border] rounded-md min-h-24">
            {columns.map((column) => (
              <Chip
                key={column.name}
                label={`${column.label} (${column.name})`}
                onClick={() => openEditColumn(column)}
                onDelete={() => handleRemoveColumn(column)}
                color="primary"
              />
            ))}
          </div>
          <div className="flex flex-row w-full justify-end">
            <Button
              color="primary"
              className="w-fit"
              startIcon={<Remove />}
              disabled={columns.length === 0}
              onClick={() => setColumns([])}
            >
              Remover todas
            </Button>
          </div>
        </div>
      </div>
      <Divider />
      <h2 className="font-semibold">Detalhes das colunas</h2>
      {table?.columns.map((column) => (
        <TableColumn
          key={column.name}
          table={table.table}
          column={column}
          isAdded={columns.includes(column)}
          onAddColumn={() => {
            setPendingColumn(column);
            setOpenDialog(true);
          }}
          onRemoveColumn={() => handleRemoveColumn(column)}
        />
      ))}
      <AddColumn
        open={openDialog}
        onClose={handleCloseDialog}
        column={pendingColumn}
        onAddColumn={handleAddColumn}
        onEditColumn={handleEditColumn}
        onRemoveColumn={handleRemoveColumn}
      />
    </div>
  );
};

export default ModuleTableView;
