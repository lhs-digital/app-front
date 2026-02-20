import {
  Clear,
  Code,
  Edit,
  FormatListBulleted,
  Save,
  Search,
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
import TableAccordion from "../ModuleTable/components/TableAccordion";

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
      buttonLabel: "Salvar",
      onClick: handleSubmit(onSubmit),
    },
    edit: {
      pageTitle: "Editar grupo de regras",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: handleSubmit(onSubmit),
    },
    view: {
      pageTitle: "Visualizar grupo de regras",
      icon: <Edit />,
      buttonLabel: "Editar",
      onClick: () => navigate(`/modulos/${moduleId}/editar`),
    },
  };

  const { pageTitle, icon, buttonLabel, onClick } = actionConfig[currentAction];

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

  const { data: activeModule = null, isPending: isPendingModule } = useQuery({
    queryKey: ["module", moduleId, company],
    queryFn: async () => {
      const response = await api.get(
        `/companies/${company.id}/audit/modules/${moduleId}`,
      );
      return response.data.data;
    },
    enabled: !!company,
    retry: false,
  });

  const { data: structure = [], isPending: isPendingStructure } = useQuery({
    queryKey: [
      "tables",
      company,
      debouncedSearch,
      pagination.current,
      pagination.perPage,
      viewMode,
    ],
    queryFn: async () => {
      const params = {
        with_module_info: moduleId,
        page: pagination.current,
        per_page: pagination.perPage,
      };
      if (viewMode === "added") {
        params.has_rule = true;
        delete params.with_module_info;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }
      const response = await api.get(`/companies/${company.id}/structure`, {
        params,
      });
      return response.data.data;
    },
    enabled: !!activeModule,
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
            <p className="text-center py-4 text-neutral-500">
              {search
                ? "Não encontramos nenhuma tabela com o nome pesquisado."
                : "Nenhuma tabela cadastrada."}
            </p>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-2">
          {structure.map((table) => (
            <TableAccordion
              key={table.id}
              table={table}
              moduleId={moduleId}
              pendingColumns={pendingChanges[table.id]?.columns ?? []}
              onColumnSave={(column) => handleColumnSave(table.id, column)}
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
        <div className="flex flex-col items-center justify-center gap-4 p-16">
          <Code fontSize="large" className="text-neutral-500" />
          <p className="text-neutral-500">
            Esta funcionalidade ainda não está disponível.
          </p>
        </div>
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
            variant="contained"
            color="primary"
            onClick={onClick}
            startIcon={icon}
          >
            {buttonLabel}
          </Button>,
        ]}
      />

      {isEditable && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField label="Nome do módulo" loading={isPendingModule}>
            <TextField fullWidth {...register("name", { required: true })} />
          </FormField>
          <FormField label="Descrição do módulo" loading={isPendingModule}>
            <TextField
              multiline
              rows={3}
              fullWidth
              {...register("description", { required: true })}
            />
          </FormField>
        </form>
      )}

      <div className="flex items-center gap-2">
        <TextField
          placeholder="Pesquisar tabelas por nome..."
          className="grow"
          value={search}
          disabled={isPendingStructure || isPendingModule}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search className="text-neutral-500 mr-2" />,
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

      {renderView()}

      {!isPendingStructure && pagination.total > pagination.perPage && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.current}
          rowsPerPage={pagination.perPage}
          onPageChange={(_, newPage) =>
            setPagination({ ...pagination, current: newPage })
          }
          onRowsPerPageChange={(e) => {
            setPagination({
              ...pagination,
              perPage: parseInt(e.target.value, 10),
            });
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="Tabelas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}`
          }
        />
      )}
    </div>
  );
};

export default ModuleView;
