import {
  CenterFocusStrong,
  DataObject,
  Edit,
  Save,
  Search,
  Widgets,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { Button, Skeleton, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TransformWrapper } from "react-zoom-pan-pinch";
import Diagram from "../../../components/ERDiagram/Diagram";
import FormField from "../../../components/FormField";
import { useCompany } from "../../../hooks/useCompany";
import useDebounce from "../../../hooks/useDebounce";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { qc } from "../../../services/queryClient";

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

const TablesSectionHeader = () => (
  <h2 className="text-lg font-bold flex flex-row gap-2 items-center">
    <span className="mb-0.5">
      <DataObject fontSize="small" />
    </span>{" "}
    <span>Tabelas</span>
  </h2>
);

const ModuleView = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { company } = useCompany();
  const location = useLocation();

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [search, setSearch] = useState(
    () => new URLSearchParams(location.search).get("search") || "",
  );

  const currentAction = getActionFromPath(location.pathname);
  const isEditable = currentAction !== "view";

  const { data: activeModule = null, isLoading: isLoadingModule } = useQuery({
    queryKey: ["module", id, company],
    queryFn: async () => {
      const response = await api.get(
        `/companies/${company.id}/audit/modules/${id}`,
      );
      return response.data.data;
    },
    enabled: !!company,
    retry: false,
  });

  const { data: structure = [], isLoading: isLoadingStructure } = useQuery({
    queryKey: ["tables", company, debouncedSearch],
    queryFn: async () => {
      const params = { with_module_info: id };
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

  const handleSearch = useCallback(
    (value) => {
      setDebouncedSearch(value);
      const params = new URLSearchParams(location.search);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      navigate(`${location.pathname}?${params.toString()}`);
    },
    [location.search, location.pathname, navigate],
  );

  useDebounce(search, 300, handleSearch);

  useEffect(() => {
    if (activeModule) {
      reset({
        name: activeModule.name,
        description: activeModule.description,
        tables: activeModule.tables.map((table) => table.id),
      });
    }
  }, [activeModule, reset]);

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
        `/companies/${company.id}/audit/modules/${id}`,
        data,
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries(["module"]);
      navigate(`/modulos/${id}`);
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
      onClick: () => navigate(`/modulos/${id}/editar`),
    },
  };

  const { pageTitle, icon, buttonLabel, onClick } = actionConfig[currentAction];

  const handleSelectTable = useCallback(
    (table) => {
      navigate(`/modulos/${id}/${table.id}?action=${currentAction}`);
    },
    [navigate, id, currentAction],
  );

  const isLoading = isLoadingStructure || isLoadingModule;

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
          <FormField label="Nome do módulo" loading={isLoadingModule}>
            <TextField fullWidth {...register("name", { required: true })} />
          </FormField>
          <FormField label="Descrição do módulo" loading={isLoadingModule}>
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
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <TablesSectionHeader />
                <span>Carregando...</span>
              </div>
              <TextField
                placeholder="Pesquisar tabelas..."
                fullWidth
                disabled
                slotProps={{
                  input: {
                    startAdornment: (
                      <Search className="text-neutral-500 mr-2" />
                    ),
                  },
                }}
              />
              <Skeleton
                variant="rectangular"
                height={480}
                className="rounded-lg"
              />
            </div>
          ) : (
            <TransformWrapper
              limitToBounds={false}
              initialPositionX={150}
              initialPositionY={150}
              initialScale={0.75}
              minScale={0.5}
              maxScale={1.5}
              wrapperStyle={{ width: "100%", height: "100%" }}
              centerZoomed
            >
              {({ zoomIn, zoomOut, centerView }) => (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-2 items-end justify-between">
                    <div className="flex flex-col gap-1">
                      <TablesSectionHeader />
                      <span>
                        Para adicionar uma ou mais colunas a este grupo,{" "}
                        <b>clique na tabela</b> que contém as colunas desejadas.
                      </span>
                    </div>
                    <div className="p-1 flex flex-row justify-between gap-2 border border-[--border] rounded-lg">
                      <div className="flex flex-row gap-4">
                        <Button
                          color="primary"
                          size="small"
                          onClick={centerView}
                          startIcon={<CenterFocusStrong />}
                        >
                          Centralizar
                        </Button>
                        <Button
                          color="primary"
                          size="small"
                          onClick={zoomIn}
                          startIcon={<ZoomIn />}
                        >
                          Aumentar
                        </Button>
                        <Button
                          color="primary"
                          size="small"
                          onClick={zoomOut}
                          startIcon={<ZoomOut />}
                        >
                          Diminuir
                        </Button>
                      </div>
                    </div>
                  </div>
                  <TextField
                    placeholder="Pesquisar tabelas..."
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Search className="text-neutral-500 mr-2" />
                        ),
                      },
                    }}
                  />
                  <div className="w-full h-[62.5vh] overflow-y-hidden border border-[--border] rounded-lg grid-bg relative">
                    <Diagram
                      data={structure}
                      isLoading={isLoadingStructure}
                      allowHover
                      onSelectTable={handleSelectTable}
                    />
                  </div>
                </div>
              )}
            </TransformWrapper>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleView;
