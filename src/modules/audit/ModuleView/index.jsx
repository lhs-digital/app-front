import {
  Clear,
  Edit,
  FormatListBulleted,
  Save,
  Search,
  SelectAll,
  Widgets,
  Window,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  TablePagination,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../../../components/FormField";
import { useCompany } from "../../../hooks/useCompany";
import useDebounce from "../../../hooks/useDebounce";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { qc } from "../../../services/queryClient";
import AddColumn from "../ModuleTable/components/AddColumn";
import TableAccordion from "../ModuleTable/components/TableAccordion";
import AddedTables from "./components/AddedTables";

const ACTION_BY_SEGMENT = {
  criar: "create",
  editar: "edit",
};

const getActionFromPath = (pathname) => {
  for (const [segment, action] of Object.entries(ACTION_BY_SEGMENT)) {
    if (pathname.includes(segment)) return action;
  }
  return "view";
};

const ModuleView = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id: moduleId } = useParams();
  const { company } = useCompany();
  const location = useLocation();
  const currentAction = getActionFromPath(location.pathname);
  const isEditable = currentAction !== "view";
  const [viewMode, setViewMode] = useState("list");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 10,
    current: 1,
  });
  const [search, setSearch] = useState(
    () => new URLSearchParams(location.search).get("search") || "",
  );

  const { mutate: createModule } = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(
        `/companies/${company.id}/audit/modules`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      navigate(`/modulos/${data.id}`);
      toast.success(`Módulo "${data.name}" criado com sucesso!`);
    },
    onError: (error) => {
      console.error("Erro ao criar módulo:", error);
      toast.error(error.message || "Erro ao criar módulo. Tente novamente.");
    },
  });

  const { mutate: updateModule } = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(
        `/companies/${company.id}/audit/modules/${moduleId}`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["module"]);
      navigate(`/modulos/${moduleId}`);
      toast.success(`Módulo "${data.name}" atualizado com sucesso!`);
    },
  });

  const submitByAction = { create: createModule, edit: updateModule };

  const onSubmit = (data) => submitByAction[currentAction]?.(data);

  const actionConfig = {
    create: {
      pageTitle: "Criar grupo de regras",
      icon: <Save />,
      variant: "contained",
      buttonLabel: "Criar",
      onClick: handleSubmit(onSubmit),
    },
    edit: {
      pageTitle: "Gerenciar grupo de regras",
      icon: <Save />,
      variant: "contained",
      buttonLabel: "Salvar",
      onClick: handleSubmit(onSubmit),
    },
    view: {
      pageTitle: "Visualizar grupo de regras",
      icon: <Edit />,
      variant: "outlined",
      buttonLabel: "Renomear",
      onClick: () => navigate(`/modulos/${moduleId}/editar`),
    },
  };

  const { pageTitle, icon, variant, buttonLabel, onClick } =
    actionConfig[currentAction];

  const [pendingChanges, setPendingChanges] = useState({});

  const handleColumnSave = (tableId, column) => {
    setPendingChanges((prev) => {
      const tableEntry = prev[tableId] ?? {
        company_table_id: tableId,
        columns: [],
      };
      const existingIdx = tableEntry.columns.findIndex(
        (c) => c.id === column.id,
      );
      const updatedColumns =
        existingIdx >= 0
          ? tableEntry.columns.map((c, i) => (i === existingIdx ? column : c))
          : [...tableEntry.columns, column];

      return {
        ...prev,
        [tableId]: { ...tableEntry, columns: updatedColumns },
      };
    });
  };

  const handleColumnRemove = (tableId, columnId) => {
    setPendingChanges((prev) => {
      const tableEntry = prev[tableId];
      if (!tableEntry) return prev;

      const updatedColumns = tableEntry.columns.filter(
        (c) => c.id !== columnId,
      );
      if (updatedColumns.length === 0) {
        return Object.fromEntries(
          Object.entries(prev).filter(([key]) => key !== String(tableId)),
        );
      }

      return {
        ...prev,
        [tableId]: { ...tableEntry, columns: updatedColumns },
      };
    });
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTableId, setActiveTableId] = useState(null);

  const handleColumnClick = (column, table) => {
    const hasRules = (column.rules?.length ?? 0) > 0;
    setActiveColumn({ ...column, edit: hasRules });
    setActiveTableId(table.id);
    setDialogOpen(true);
  };

  const handleDialogSave = (column) => {
    if (activeTableId) {
      handleColumnSave(activeTableId, column);
    }
    setDialogOpen(false);
    setActiveColumn(null);
    setActiveTableId(null);
  };

  const handleDialogRemove = (column) => {
    if (activeTableId) {
      handleColumnRemove(activeTableId, column.id);
    }
    setDialogOpen(false);
    setActiveColumn(null);
    setActiveTableId(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setActiveColumn(null);
    setActiveTableId(null);
  };

  const { data: activeModule = null, isPending: isPendingModule } = useQuery({
    queryKey: ["module", moduleId, company],
    queryFn: async () => {
      const response = await api.get(
        `/companies/${company.id}/audit/modules/${moduleId}`,
      );
      return response.data.data;
    },
    enabled: !!company && currentAction !== "create",
    retry: false,
  });

  const { data: structure = [], isPending: isPendingStructure } = useQuery({
    queryKey: ["tables", company, debouncedSearch, pagination, viewMode],
    queryFn: async () => {
      const params = {
        with_module_info: moduleId,
        page: pagination.current,
        per_page: pagination.perPage,
      };
      if (viewMode === "added") {
        params.has_rules = 1;
        delete params.with_module_info;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      const response = await api.get(`/companies/${company.id}/structure`, {
        params,
      });
      setPagination({
        total: response.data.meta.total,
        from: response.data.meta.from,
        to: response.data.meta.to,
        current: response.data.meta.current_page,
        perPage: response.data.meta.per_page,
      });
      return response.data.data;
    },
    enabled: !!activeModule && currentAction !== "create",
  });

  useEffect(() => {
    if (activeModule) {
      reset({
        name: activeModule.name,
        description: activeModule.description,
        tables: activeModule.tables.map((table) => table.id),
      });
    }
  }, [activeModule, reset]);

  const handleSearch = (value) => {
    setDebouncedSearch(value);
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  useDebounce(search, 300, handleSearch);

  const renderView = () => {
    if (currentAction === "create") {
      return (
        <div className="grid-bg flex flex-col gap-4 items-center justify-center py-4 h-32 border border-[--border] rounded-lg">
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            Crie um grupo de regras para começar a gerenciar as regras de
            auditoria.
          </p>
        </div>
      );
    }
    if (isPendingStructure || isPendingModule) {
      return (
        <div className="flex items-center justify-center py-4 h-64">
          <CircularProgress size={42} />
        </div>
      );
    }
    if (viewMode === "list") {
      if (structure.length === 0) {
        return (
          <div className="flex items-center justify-center py-4 h-64">
            <p className="text-center py-4 text-zinc-500">
              {search
                ? "Não encontramos nenhuma tabela com o nome pesquisado."
                : "Nenhuma tabela cadastrada."}
            </p>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center justify-between gap-1 p-2 border-b border-[--border] mb-2">
            <div className="flex items-center gap-2">
              <SelectAll fontSize="small" color="inherit" />
              <h2>Todas as tabelas</h2>
            </div>
          </div>
          {structure.map((table) => (
            <TableAccordion
              key={table.id}
              table={table}
              pendingColumns={pendingChanges[table.id]}
              onColumnClick={handleColumnClick}
              onColumnRemove={(columnId) =>
                handleColumnRemove(table.id, columnId)
              }
            />
          ))}
        </div>
      );
    }

    if (viewMode === "added") {
      return (
        <AddedTables tables={structure} onColumnClick={handleColumnClick} />
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <PageTitle
        title={activeModule?.name || pageTitle}
        subtitle={activeModule?.description || "Grupo de regras"}
        icon={<Widgets />}
        buttons={[
          <Button
            key="action-module"
            type="button"
            color="primary"
            onClick={onClick}
            startIcon={icon}
            variant={variant}
          >
            {buttonLabel}
          </Button>,
        ]}
      />

      {isEditable && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Nome do grupo"
            loading={isPendingModule && currentAction !== "create"}
          >
            <TextField fullWidth {...register("name", { required: true })} />
          </FormField>
          <FormField
            label="Descrição do grupo"
            loading={isPendingModule && currentAction !== "create"}
          >
            <TextField
              multiline
              rows={3}
              fullWidth
              {...register("description", { required: true })}
            />
          </FormField>
        </form>
      )}

      {currentAction !== "create" && (
        <div className="flex items-center gap-2">
          <TextField
            placeholder="Pesquisar tabelas por nome..."
            className="grow"
            value={search}
            disabled={isPendingStructure || isPendingModule}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <Search className="text-zinc-500 mr-2" />,
                endAdornment: search &&
                  !(isPendingStructure || isPendingModule) && (
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <Clear fontSize="small" />
                    </IconButton>
                  ),
              },
            }}
          />
          <ToggleButtonGroup
            exclusive
            value={viewMode}
            onChange={(_, value) => value && setViewMode(value)}
            className="h-14 rounded-lg overflow-hidden border border-[var(--border)]"
            size="large"
            variant="outlined"
            sx={{
              "& .MuiToggleButton-root": {
                border: "none",
              },
            }}
          >
            <Tooltip title="Listar tabelas">
              <ToggleButton value="list">
                <FormatListBulleted />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="Colunas adicionadas">
              <ToggleButton value="added">
                <Window />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </div>
      )}

      {renderView()}

      {!isPendingStructure && (
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          labelRowsPerPage="Linhas por página"
          count={pagination.total || 0}
          rowsPerPage={pagination.perPage}
          page={pagination.current}
          onPageChange={(_, newPage) =>
            setPagination({ ...pagination, current: newPage })
          }
          labelDisplayedRows={({ count }) =>
            `${pagination.from}–${pagination.to} de ${count !== -1 ? count : `mais de ${pagination.to}`}`
          }
        />
      )}

      <AddColumn
        open={dialogOpen}
        onClose={handleDialogClose}
        column={activeColumn}
        onAddColumn={handleDialogSave}
        onEditColumn={handleDialogSave}
        onRemoveColumn={() => handleDialogRemove(activeColumn)}
      />
    </div>
  );
};

export default ModuleView;
