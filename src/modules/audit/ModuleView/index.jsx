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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../../../components/FormField";
import { useCompany } from "../../../hooks/useCompany";
import useDebounce from "../../../hooks/useDebounce";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import {
  applyColumnRemove,
  applyColumnSave,
  formatModuleTablesPayload,
} from "../../../services/formatters";
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
  const [expanded, setExpanded] = useState("");
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
      toast.success(`Grupo de regras "${data.name}" criado com sucesso!`);
    },
    onError: (error) => {
      console.error("Erro ao criar grupo de regras:", error);
      toast.error(
        error.message || "Erro ao criar grupo de regras. Tente novamente.",
      );
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

  const allowNavigationRef = useRef(false);

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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTableId, setActiveTableId] = useState(null);

  const closeDialog = () => {
    setDialogOpen(false);
    setActiveColumn(null);
    setActiveTableId(null);
  };

  const handleColumnClick = (column, table) => {
    const hasRules = (column.rules?.length ?? 0) > 0;
    setActiveColumn({ ...column, edit: hasRules });
    setActiveTableId(table.id);
    setDialogOpen(true);
  };

  const handleDialogSave = (column) => {
    if (!activeTableId) return;
    toast.promise(
      saveTableRulesAsync({
        tableId: activeTableId,
        structure,
        action: column?.edit ? "edit" : "add",
        columnOrId: column,
      }).then(closeDialog),
      {
        pending: "Salvando regra(s)...",
        success: "Regra(s) salva(s) com sucesso!",
        error: "Erro ao salvar regra(s). Tente novamente.",
      },
    );
  };

  const handleDialogRemove = (column) => {
    if (!activeTableId || !column) return;
    toast.promise(
      saveTableRulesAsync({
        tableId: activeTableId,
        structure,
        action: "remove",
        columnOrId: column.id,
      }).then(closeDialog),
      {
        pending: "Excluindo regra(s)...",
        success: "Regra(s) excluída(s) com sucesso!",
        error: "Erro ao excluir regra(s). Tente novamente.",
      },
    );
  };

  const handleDialogClose = () => closeDialog();

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

  const {
    data: structure = [],
    isPending: isPendingStructure,
    refetch: refetchStructure,
  } = useQuery({
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

  const { mutateAsync: saveTableRulesAsync, isPending: isSavingTable } =
    useMutation({
      mutationFn: async ({
        tableId,
        structure: structureData,
        action,
        columnOrId,
      }) => {
        const pending =
          action === "remove"
            ? applyColumnRemove({}, tableId, columnOrId)
            : applyColumnSave({}, tableId, columnOrId);
        const formatted = formatModuleTablesPayload(pending, structureData);
        const payload = formatted[0];
        if (!payload) throw new Error("Payload vazio");
        await api.post(
          `/companies/${company.id}/audit/modules/${moduleId}/tables`,
          payload,
        );
      },
      onSuccess: () => {
        refetchStructure();
      },
    });

  useBlocker(() => {
    if (isSavingTable && !allowNavigationRef.current) {
      toast.warning("Salvando colunas...");
      return true;
    }
    allowNavigationRef.current = false;
    return false;
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
              isExpanded={expanded === table.id}
              onExpand={() =>
                setExpanded(expanded === table.id ? "" : table.id)
              }
              key={table.id}
              table={table}
              onColumnClick={handleColumnClick}
              onColumnRemove={(columnId) =>
                toast.promise(
                  saveTableRulesAsync({
                    tableId: table.id,
                    structure,
                    action: "remove",
                    columnOrId: columnId,
                  }),
                  {
                    pending: "Excluindo regra(s)...",
                    success: "Regra(s) excluída(s) com sucesso!",
                    error: "Erro ao excluir regra(s). Tente novamente.",
                  },
                )
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
