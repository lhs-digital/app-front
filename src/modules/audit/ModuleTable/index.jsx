import { Edit, Remove, Save, TableChart } from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import TableColumn from "../../../components/AuditComponents/TableColumn";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import AddColumn from "./components/AddColumn";

const ModuleTableView = () => {
  const { id, table } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");

  const handleSaveChanges = async () => {
    try {
      // Validar se temos todos os dados necessários
      if (!company?.id || !id || !columnsData.company_table_id) {
        toast.error("Dados insuficientes para salvar. Recarregue a página.");
        return;
      }

      const formattedData = {
        company_table_id: columnsData.company_table_id,
        columns: columnsData.columns.map((column) => ({
          id: column.id,
          label: column.label,
          rules: column.rules.map((rule) => {
            const formattedRule = {
              name: rule.name,
              message: rule.message,
              params: rule.params || "",
              priority: rule.priority || 1,
            };

            const validationRule = validationRules.find(
              (v) => v.name === rule.name,
            );
            if (validationRule) {
              formattedRule.id = validationRule.id;
            } else if (rule.id && rule.audit_table_id) {
              formattedRule.id = rule.id;
            }

            if (rule.audit_table_id) {
              formattedRule.audit_table_id = rule.audit_table_id;
            }

            if (rule.label) {
              formattedRule.label = rule.label;
            }

            return formattedRule;
          }),
        })),
      };

      await api.post(
        `/companies/${company.id}/audit/modules/${id}/tables`,
        formattedData,
      );

      setHasChanges(false);
      setSearchParams({ action: "view" });
      toast.success("Colunas salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      console.error("Detalhes do erro:", error.response?.data);
      toast.error("Erro ao salvar colunas. Tente novamente.");
    }
  };

  const actions = {
    create: {
      pageTitle: "Adicionar colunas",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: handleSaveChanges,
    },
    edit: {
      pageTitle: "Editar colunas",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: handleSaveChanges,
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
  const [columnsData, setColumnsData] = useState({
    company_table_id: null,
    columns: [],
  });
  const [unselectedColumns, setUnselectedColumns] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const { company } = useCompany();

  const { data: validationRules = [] } = useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const response = await api.get("/rules");
      return response.data.data;
    },
  });

  const { data: tableData = {}, isLoading: isLoadingTable } = useQuery({
    queryKey: ["tables", company, table],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/structure`, {
        params: { with_rules: id },
      });
      console.log("Response data:", response.data.data);
      const data = response.data.data.find((t) => t.id === parseInt(table));
      return data;
    },
    enabled: !!table,
  });

  useEffect(() => {
    if (!isLoadingTable) {
      const selectedColumns = tableData.columns.filter(
        (c) => c.rules.length > 0,
      );
      const unselectedColumns = tableData.columns.filter(
        (c) => c.rules.length === 0,
      );

      setUnselectedColumns(unselectedColumns);
      setColumnsData({
        company_table_id: tableData.id,
        columns: selectedColumns,
      });
      setHasChanges(false);
    }
  }, [isLoadingTable]);

  const handleAddColumn = (column) => {
    setColumnsData((prev) => ({
      ...prev,
      columns: [...prev.columns, column],
    }));
    setUnselectedColumns(unselectedColumns.filter((c) => c.id !== column.id));
    setOpenDialog(false);
    setHasChanges(true);
  };

  const handleRemoveColumn = (column) => {
    setColumnsData((prev) => ({
      ...prev,
      columns: prev.columns.filter((c) => c.id !== column.id),
    }));
    setUnselectedColumns([...unselectedColumns, column]);
    setHasChanges(true);
    setOpenDialog(false);
  };

  const openEditColumn = (column) => {
    setPendingColumn({ ...column, edit: true });
    setOpenDialog(true);
  };

  const handleEditColumn = (column) => {
    setColumnsData((prev) => ({
      ...prev,
      columns: prev.columns.map((c) => (c.id === column.id ? column : c)),
    }));
    setOpenDialog(false);
    setHasChanges(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPendingColumn(null);
  };

  const removeAllColumns = () => {
    setColumnsData((prev) => ({
      ...prev,
      columns: [],
    }));
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
              {columnsData.columns.map((column) => (
                <Chip
                  key={column.name}
                  label={`${column.label} (${column.name})`}
                  onClick={
                    action === "view" ? undefined : () => openEditColumn(column)
                  }
                  onDelete={
                    action === "view"
                      ? undefined
                      : () => handleRemoveColumn(column)
                  }
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
                disabled={columnsData.columns.length === 0}
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
            readOnly={action === "view"}
            table={table.table}
            column={column}
            isAdded={columnsData.columns.includes(column)}
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
        companyTableId={tableData.id}
        moduleId={id}
        onAddColumn={handleAddColumn}
        onEditColumn={handleEditColumn}
        onRemoveColumn={handleRemoveColumn}
      />
    </div>
  );
};

export default ModuleTableView;
