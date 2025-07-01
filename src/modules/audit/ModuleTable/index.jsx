import { Edit, Remove, Save, TableChart } from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TableColumn from "../../../components/AuditComponents/TableColumn";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import AddColumn from "./components/AddColumn";

const ModuleTableView = () => {
  const { id, table } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");
  const actions = {
    add: {
      pageTitle: "Adicionar colunas",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: () => {},
    },
    edit: {
      pageTitle: "Editar colunas",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: () => {
        setSearchParams({ action: "view" });
      },
    },
    view: {
      pageTitle: "Visualizar colunas",
      icon: <Edit />,
      buttonLabel: "Editar",
      onClick: () => {
        setSearchParams({ action: "edit" });
      },
    },
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(null);
  const [columns, setColumns] = useState([]);
  const [unselectedColumns, setUnselectedColumns] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const { company } = useCompany();

  // const { data } = useQuery({
  //   queryKey: ["tables", id],
  //   queryFn: async () => {
  //     const response = await api.get(
  //       `/companies/${company.id}/audit/modules/${id}/tables/${table.id}/rules`,
  //     );
  //     console.log(
  //       "🌐 [API] companies/${company.id}/audit/modules/${id}/tables/rules",
  //       response.data.data,
  //     );
  //     console.log("[PAGE STATE] Module:", table);
  //     const selectedColumns = response.data.data
  //       .filter((c) => table.columns.some((col) => col.rules[0].id === c.id))
  //       .map((c) => {
  //         // console.log("[MAP] Column:", c);
  //         const column = table.columns.find((col) => col.id === c.id);
  //         return {
  //           ...c,
  //           name: column.name,
  //           label: column.label,
  //           type: column.type,
  //           edit: false,
  //         };
  //       });
  //     const unselectedColumns = table.columns.filter((col) =>
  //       response.data.data.some((c) => c.id !== col.id),
  //     );
  //     setUnselectedColumns(unselectedColumns);
  //     setColumns(selectedColumns);
  //     return response.data.data;
  //   },
  //   enabled: !!table,
  // });

  const { data: tableData = {}, isLoading: isLoadingTable } = useQuery({
    queryKey: ["tables", company, table],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/structure`, {
        params: { with_rules: id },
      });

      const data = response.data.data.find((t) => t.id === parseInt(table));
      const selectedColumns = data.columns.filter((c) => c.rules.length > 0);
      const unselectedColumns = data.columns.filter(
        (c) => c.rules.length === 0,
      );

      setUnselectedColumns(unselectedColumns);
      setColumns(selectedColumns);
      setHasChanges(false);
      return data;
    },
    enabled: !!table,
  });

  const handleAddColumn = (column) => {
    setColumns([...columns, column]);
    setUnselectedColumns(unselectedColumns.filter((c) => c.id !== column.id));
    setOpenDialog(false);
    setHasChanges(true);
  };

  const handleRemoveColumn = (column) => {
    setColumns(columns.filter((c) => c.id !== column.id));
    setUnselectedColumns([...unselectedColumns, column]);
    setHasChanges(true);
    setOpenDialog(false);
  };

  const openEditColumn = (column) => {
    setPendingColumn({ ...column, edit: true });
    setOpenDialog(true);
  };

  const handleEditColumn = (column) => {
    setColumns(columns.map((c) => (c.id === column.id ? column : c)));
    setOpenDialog(false);
    setHasChanges(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPendingColumn(null);
  };

  const removeAllColumns = () => {
    setColumns([]);
    setUnselectedColumns(tableData.columns);
    setHasChanges(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <PageTitle
        title={actions[action].pageTitle || "Tabela"}
        tag={hasChanges && "Você tem alterações não salvas"}
        icon={<TableChart />}
        subtitle={`Tabela "${tableData.name || "..."}"`}
        buttons={[
          <Button
            key="table-action"
            type="button"
            variant="contained"
            color="primary"
            onClick={actions[action].onClick}
            startIcon={actions[action].icon}
          >
            {actions[action].buttonLabel}
          </Button>,
        ]}
      />
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Colunas adicionadas</h2>
          <p className="text-sm text-neutral-500">
            Clique para editar ou remover uma coluna
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {isLoadingTable ? (
            <div className="flex flex-row w-full justify-end">
              <Skeleton variant="text" height={"96px"} className="w-full" />
            </div>
          ) : (
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
          )}
          {action !== "view" && (
            <div className="flex flex-row w-full justify-end">
              <Button
                color="primary"
                className="w-fit"
                startIcon={<Remove />}
                disabled={columns.length === 0}
                onClick={removeAllColumns}
              >
                Remover todas
              </Button>
            </div>
          )}
        </div>
      </div>
      <Divider />
      <h2 className="font-semibold">Colunas não adicionadas</h2>
      {isLoadingTable ? (
        <div className="flex flex-row w-full justify-center py-6">
          <CircularProgress />
        </div>
      ) : unselectedColumns.length > 0 ? (
        unselectedColumns.map((column) => (
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
        ))
      ) : (
        <p className="text-neutral-500">
          Todas as colunas já foram adicionadas
        </p>
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

export default ModuleTableView;
