import { Remove } from "@mui/icons-material";
import { Button, Chip, Divider } from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import TableColumn from "../../CompanyModules/components/TableColumn";

const TablesTab = () => {
  const { setValue, getValues, watch } = useFormContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(null);

  const tablesList = watch("tables") || [];

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Tabelas adicionadas</h2>
          <p className="text-sm text-neutral-500">
            Clique para editar ou remover uma tabela
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 flex-wrap px-2 py-4 border border-[--border] rounded-md min-h-24">
            {tablesList.map((table) => (
              <Chip
                key={table.name}
                label={`${table.label} (${table.name})`}
                onClick={() => {}}
                onDelete={() => {}}
                color="primary"
              />
            ))}
          </div>
          <Button
            color="primary"
            startIcon={<Remove />}
            disabled={tablesList.length === 0}
            onClick={() => setValue("tables", [])}
          >
            Remover todas
          </Button>
        </div>
      </div>
      <Divider />
      <h2 className="font-semibold">Detalhes das tabelas</h2>
      {tablesList.map((table) => (
        <TableColumn
          key={table.name}
          column={table}
          isAdded={tablesList.includes(table)}
        />
      ))}
    </div>
  );
};

export default TablesTab;
