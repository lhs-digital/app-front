import { Remove, TableChart } from "@mui/icons-material";
import { Button, Chip, Divider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import TableColumn from "../../../components/AuditComponents/TableColumn";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import AddColumn from "./components/AddColumn";

const ModuleTableView = () => {
  const { table } = useLocation().state;
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(null);
  const [columns, setColumns] = useState([]);
  const [unselectedColumns, setUnselectedColumns] = useState([]);
  const { company } = useCompany();

  const { data } = useQuery({
    queryKey: ["tables", id],
    queryFn: async () => {
      const response = await api.get(
        `/companies/${company.id}/audit/modules/${id}/tables/${table.id}/rules`,
      );
      console.log(
        "🌐 [API] companies/${company.id}/audit/modules/${id}/tables/rules",
        response.data.data,
      );
      console.log("[PAGE STATE] Module:", table);
      const selectedColumns = response.data.data
        .filter((c) => table.columns.some((col) => col.rules[0].id === c.id))
        .map((c) => {
          // console.log("[MAP] Column:", c);
          const column = table.columns.find((col) => col.id === c.id);
          return {
            ...c,
            name: column.name,
            label: column.label,
            type: column.type,
            edit: false,
          };
        });
      const unselectedColumns = table.columns.filter((col) =>
        response.data.data.some((c) => c.id !== col.id),
      );
      setUnselectedColumns(unselectedColumns);
      setColumns(selectedColumns);
      return response.data.data;
    },
    enabled: !!table,
  });

  const handleAddColumn = (column) => {
    console.log(column);
    setColumns([...columns, column]);
    setOpenDialog(false);
  };

  const handleRemoveColumn = (column) => {
    setColumns(columns.filter((c) => c.name !== column.name));
  };

  const openEditColumn = (column) => {
    setPendingColumn({ ...column, edit: true });
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
      {unselectedColumns.map((column) => (
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
