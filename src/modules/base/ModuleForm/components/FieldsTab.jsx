import { Remove } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import TableColumn from "../../CompanyModules/components/TableColumn";
import AddColumn from "./AddColumn";

const FieldsTab = ({ table }) => {
  const { setValue, getValues, watch } = useFormContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(null);

  const columnList = watch("columns") || [];

  const handleAddColumn = (column) => {
    console.log(column);
    let columns = getValues("columns") || [];
    columns = [...columns, column];
    setValue("columns", columns);
    setOpenDialog(false);
  };

  const handleRemoveColumn = (column) => {
    let columns = getValues("columns") || [];
    columns = columns.filter((c) => c.name !== column.name);
    setValue("columns", columns);
  };

  const addAllColumns = () => {
    let columns = getValues("columns") || [];
    columns = [...columns, ...table.columns];
    setValue("columns", columns);
  };

  const openEditColumn = (column) => {
    setPendingColumn({
      ...column,
      edit: true,
    });
    setOpenDialog(true);
  };

  const handleEditColumn = (column) => {
    let columns = getValues("columns") || [];
    columns = columns.map((c) => (c.name === column.name ? column : c));
    setValue("columns", columns);
    setOpenDialog(false);
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Colunas adicionadas</h2>
          <p className="text-sm text-neutral-500">
            Clique para editar ou remover uma coluna
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 flex-wrap px-2 py-4 border border-[--border] rounded-md min-h-24">
            {columnList.map((column) => (
              <Chip
                key={column.name}
                label={`${column.label} (${column.name})`}
                onClick={() => openEditColumn(column)}
                onDelete={() => handleRemoveColumn(column)}
                color="primary"
              />
            ))}
          </div>
          <div className="flex flex-row gap-4 justify-end">
            <Button
              color="primary"
              startIcon={<Remove />}
              disabled={columnList.length === 0}
              onClick={() => setValue("columns", [])}
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
          column={column}
          isAdded={columnList.includes(column)}
          onAddColumn={() => {
            setPendingColumn(column);
            setOpenDialog(true);
          }}
          onRemoveColumn={() => handleRemoveColumn(column)}
        />
      ))}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {pendingColumn && !pendingColumn.edit
            ? "Adicionar coluna"
            : "Editar coluna"}
        </DialogTitle>
        <DialogContent>
          <AddColumn
            column={pendingColumn}
            onAddColumn={handleAddColumn}
            onEditColumn={handleEditColumn}
            onRemoveColumn={handleRemoveColumn}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FieldsTab;
