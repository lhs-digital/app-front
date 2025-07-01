import { Remove } from "@mui/icons-material";
import { Button, Chip, Divider } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import TableColumn from "../../../../components/AuditComponents/TableColumn";
import { useModuleForm } from "../index";
import AddColumn from "../../ModuleTable/components/AddColumn";

const FieldsTab = () => {
  const { setValue, getValues, watch } = useFormContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(null);
  const { activeModule } = useModuleForm();

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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPendingColumn(null);
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
      <Divider />
      <h2 className="font-semibold">Detalhes das colunas</h2>
      {activeModule?.tables.map((table) =>
        table?.columns.map((column) => (
          <TableColumn
            key={column.name}
            table={table.table}
            column={column}
            isAdded={columnList.includes(column)}
            onAddColumn={() => {
              setPendingColumn(column);
              setOpenDialog(true);
            }}
            onRemoveColumn={() => handleRemoveColumn(column)}
          />
        )),
      )}
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

export default FieldsTab;
