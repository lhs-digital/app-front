import {
  Add,
  Edit,
  Remove,
  Save,
  Search,
  TableChart,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Skeleton,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useBlocker } from "react-router-dom";
import { useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import TableColumn from "../../../components/AuditComponents/TableColumn";
import ConfirmDialog from "../../../components/Miscellaneous/ConfirmationDialog";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { qc } from "../../../services/queryClient";
import AddColumn from "./components/AddColumn";
import RuleChip from "./components/RuleChip";
import ModalDelete from "../../../components/ModalDelete";

const ModuleTableView = () => {
  const { id, table } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const action = searchParams.get("action");
  const [isDeleteRuleOpen, setIsDeleteRuleOpen] = useState(false);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(null);
  const [columnsData, setColumnsData] = useState({
    company_table_id: null,
    columns: [],
  });
  const [unselectedColumns, setUnselectedColumns] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [filterText, setFilterText] = useState("");
  const { company } = useCompany();
  const allowNavigationRef = useRef(false);

  useBlocker((tx) => {
    if (hasChanges && !allowNavigationRef.current) {
      toast.warning("Você tem alterações não salvas!");
      return true; // bloqueia navegação
    }
    allowNavigationRef.current = false; // reseta após navegação
    return false; // permite navegação
  });

  const { mutate: saveChanges, isPending } = useMutation({
    mutationFn: async () => {
      if (!company?.id || !id || !columnsData.company_table_id) {
        toast.error("Dados insuficientes para salvar. Recarregue a página.");
      }

      const formattedData = {
        company_table_id: columnsData.company_table_id,
        columns: columnsData.columns.map((column) => ({
          id: column.id,
          label: column.label,
          form: column.form || {},
          rules: column.rules.map((rule) => {
            const formattedRule = {
              name: rule.name || rule.validation.name,
              message: rule.message,
              params: rule.params || "",
              priority: rule.priority || 1,
              id: rule.validation?.id || rule.id,
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

      return await api.post(
        `/companies/${company.id}/audit/modules/${id}/tables`,
        formattedData,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["tables"],
      });
      qc.invalidateQueries({
        queryKey: ["module"],
      });

      setHasChanges(false);
      setSearchParams({ action: "view" });
      toast.success("Colunas salvas com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao salvar:", error);
      console.error("Detalhes do erro:", error.response?.data);
      toast.error(error.message || "Erro ao salvar colunas. Tente novamente.");
    },
  });

  const handleSaveChanges = () => {
    if (isPending) {
      return;
    }
    allowNavigationRef.current = true;
    saveChanges();
  };

  const actions = {
    create: {
      pageTitle: "Adicionar regras",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: handleSaveChanges,
    },
    edit: {
      pageTitle: "Editar regras",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: handleSaveChanges,
    },
    view: {
      pageTitle: "Visualizar regras",
      icon: <Edit />,
      buttonLabel: "Editar",
      onClick: () => {
        setSearchParams({ action: "edit" });
      },
      disabled: false,
    },
  };

  const { data: validationRules = [], isLoading: isLoadingRules } = useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const response = await api.get("/rules");
      return response.data.data;
    },
  });

  const { data: tableData = {}, isLoading: isLoadingTable } = useQuery({
    queryKey: ["tables", company, table, id],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/structure`, {
        params: { with_module_info: id },
      });
      const data = response.data.data.find((t) => t.id === parseInt(table));
      const selectedColumns = data.columns.filter((c) => c.rules.length > 0);
      const unselectedColumns = data.columns.filter(
        (c) => c.rules.length === 0,
      );
      setUnselectedColumns(unselectedColumns);
      setColumnsData({
        company_table_id: data.id,
        columns: selectedColumns,
      });
      setHasChanges(false);

      return data;
    },
    refetchInterval: action !== "view" ? false : 1500,
    enabled: !!table && !!id && !isLoadingRules,
  });

  const handleAddColumn = (column) => {
    setColumnsData((prev) => ({
      ...prev,
      columns: [...prev.columns, column],
    }));
    setUnselectedColumns(unselectedColumns.filter((c) => c.id !== column.id));
    setOpenDialog(false);
    setPendingColumn(null);
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
    setPendingColumn(null);
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
    setPendingColumn(null);
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
            disabled={actions[action].disabled}
            loading={isPending}
          >
            {actions[action].buttonLabel}
          </Button>,
        ]}
      />
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold">Regras adicionadas</h2>
          {action !== "view" && (
            <p className="text-md text-neutral-500">
              Selecione uma coluna no campo abaixo para editar ou remover suas
              regras.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {isLoadingTable ? (
            <div className="flex flex-row w-full justify-end">
              <Skeleton variant="text" height={"96px"} className="w-full" />
            </div>
          ) : (
            <div
              className={`flex flex-row ${action === "view" ? "gap-2" : "gap-4"} flex-wrap px-4 py-4 border border-[--border] rounded-md min-h-24`}
            >
              {columnsData.columns.map((column) => (
                <RuleChip
                  disabled={isLoadingRules || isLoadingTable || isPending}
                  key={column.id}
                  column={column}
                  onClick={
                    action === "view" ? undefined : () => openEditColumn(column)
                  }
                  onDelete={
                    action === "view"
                      ? undefined
                      : () => {
                        setRuleToDelete(column);
                        setIsDeleteRuleOpen(true);
                      }
                  }
                  readOnly={action === "view"}
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
                onClick={() => setIsDeleteAllOpen(true)}
              >
                Remover todas
              </Button>
            </div>
          )}
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold">Colunas sem regras</h2>
          {action !== "view" && (
            <p className="text-md text-neutral-500">
              Clique no{" "}
              <span className="bg-neutral-500/30 mx-0.5 border border-[--border] rounded-full">
                <Add fontSize="small" className="mb-0.5" />
              </span>{" "}
              ao lado de uma coluna para adicioná-la ao grupo de regras.
            </p>
          )}
        </div>
        <TextField
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          aria-label="Pesquisar colunas"
          placeholder="Comece a digitar para pesquisar colunas..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          variant="outlined"
          fullWidth
        />
      </div>
      {isLoadingTable ? (
        <div className="flex flex-row w-full justify-center py-6">
          <CircularProgress />
        </div>
      ) : unselectedColumns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unselectedColumns
            .filter(
              (column) =>
                filterText === "" ||
                column.name.toLowerCase().includes(filterText.toLowerCase()) ||
                column.label?.toLowerCase().includes(filterText.toLowerCase()),
            )
            .map((column) => (
              <TableColumn
                key={column.name}
                readOnly={action === "view"}
                table={table.table}
                column={column}
                isAdded={columnsData.columns.includes(column)}
                onAddColumn={() => {
                  const cleanColumn = {
                    ...column,
                    rules: [],
                  };
                  setPendingColumn(cleanColumn);
                  setOpenDialog(true);
                }}
                onRemoveColumn={() => handleRemoveColumn(column)}
              />
            ))}
        </div>
      ) : (
        <p className="text-neutral-500">
          Todas as colunas já foram adicionadas
        </p>
      )}
      <ConfirmDialog
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        title="Confirmar remoção"
        message={`Tem certeza que deseja remover a coluna "${pendingColumn?.name}"?`}
        onAccept={() => {
          handleRemoveColumn(pendingColumn);
          setOpenConfirmDialog(false);
        }}
        onReject={() => setOpenConfirmDialog(false)}
      />
      <ModalDelete
        isOpen={isDeleteRuleOpen}
        isRuleUnic={true}
        onClose={() => setIsDeleteRuleOpen(false)}
        onConfirm={() => {
          handleRemoveColumn(ruleToDelete);
          setIsDeleteRuleOpen(false);
        }}
      />
      <ModalDelete
        isOpen={isDeleteAllOpen}
        isRuleAll={true}
        onClose={() => setIsDeleteAllOpen(false)}
        onConfirm={() => {
          removeAllColumns();
          setIsDeleteAllOpen(false);
        }}
        message="Tem certeza que deseja remover todas as colunas?"
      />
      <AddColumn
        open={openDialog}
        onClose={handleCloseDialog}
        column={pendingColumn}
        companyTableId={tableData.id}
        moduleId={id}
        onAddColumn={handleAddColumn}
        onEditColumn={handleEditColumn}
        onRemoveColumn={() => {
          handleRemoveColumn(pendingColumn);
          setOpenDialog(false);
          setOpenConfirmDialog(true);
        }}
      />
    </div>
  );
};

export default ModuleTableView;
