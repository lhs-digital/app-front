import { Add, Remove } from "@mui/icons-material";
import { Button, Chip, Divider } from "@mui/material";
import { useState } from "react";
import TableColumn from "../../CompanyModules/components/TableColumn";

const FieldsTab = ({ table }) => {
  const [columnList, setColumnList] = useState([]);

  const handleAddColumn = (column) => {
    setColumnList((prev) => [...prev, column]);
  };

  const handleRemoveColumn = (column) => {
    setColumnList((prev) => prev.filter((c) => c.name !== column.name));
  };

  const addAllColumns = () => {
    setColumnList(table.columns);
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold">Colunas adicionadas</h2>
        <div className="flex flex-row gap-2 flex-wrap px-2 py-4 border border-[--border] rounded-md min-h-24">
          {columnList.map((column) => (
            <Chip
              key={column.name}
              label={column.name}
              onDelete={() => handleRemoveColumn(column)}
              color="primary"
              size="small"
              className="cursor-pointer"
            />
          ))}
        </div>
        <div className="flex flex-row gap-4 justify-end">
          <Button color="primary" startIcon={<Add />} onClick={addAllColumns}>
            Adicionar todas
          </Button>
          <Button
            color="primary"
            startIcon={<Remove />}
            onClick={() => setColumnList([])}
          >
            Remover todas
          </Button>
        </div>
      </div>
      <Divider />
      <h2 className="font-semibold">Detalhes das colunas</h2>
      {table?.columns.map((column) => (
        <TableColumn
          key={column.name}
          column={column}
          isAdded={columnList.includes(column)}
          onAddColumn={() => handleAddColumn(column)}
          onRemoveColumn={() => handleRemoveColumn(column)}
        />
      ))}
    </div>
  );
};

export default FieldsTab;
