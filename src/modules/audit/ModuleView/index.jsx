import {
  CenterFocusStrong,
  DataObject,
  Edit,
  Save,
  Widgets,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import { Button, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TransformWrapper } from "react-zoom-pan-pinch";
import Diagram from "../../../components/ERDiagram/Diagram";
import { parseStructure } from "../../../components/ERDiagram/erUtility";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import InformationTab from "./components/InformationTab";

const ModuleFormContext = createContext();

export const ModuleForm = () => {
  const { id } = useParams();
  const { company } = useCompany();
  const location = useLocation();
  const currentAction = location.pathname.includes("criar")
    ? "create"
    : location.pathname.includes("editar")
      ? "edit"
      : "view";

  const { data: activeModule = null, isLoading: isLoadingModules } = useQuery({
    queryKey: ["module", id, company],
    queryFn: async () => {
      const response = await api.get(
        `/companies/${company.id}/audit/modules/${id}`,
      );
      console.log(
        "🌐 [API] companies/${company.id}/audit/modules/${id}",
        response.data,
      );
      return response.data.data;
    },
    enabled: !!company,
    retry: false,
  });

  const { data: structure = [], isLoading: isLoadingStructure } = useQuery({
    queryKey: ["tables", company],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/structure`, {
        params: { with_rules: id },
      });
      console.log(
        "🌐 [API] companies/${company.id}/structure",
        response.data.data,
      );
      const existingTables = activeModule.tables.map(
        (table) => table.company_table_id,
      );
      return parseStructure(response.data.data, existingTables);
    },
    enabled: !!activeModule,
  });

  return (
    <ModuleFormContext.Provider
      value={{
        id,
        location,
        currentAction,
        activeModule,
        structure,
        isLoadingModules,
        isLoadingStructure,
      }}
    >
      <Form />
    </ModuleFormContext.Provider>
  );
};

export const useModuleForm = () => {
  const context = useContext(ModuleFormContext);
  if (context === undefined) {
    throw new Error("useModuleForm must be used within a ModuleFormProvider");
  }
  return context;
};

const Form = () => {
  const navigate = useNavigate();
  const { id, activeModule, currentAction, structure, isLoadingStructure } =
    useModuleForm();
  const methods = useForm({
    defaultValues: { name: "", description: "", tables: [] },
  });

  useEffect(() => {
    if (activeModule) {
      methods.reset({
        name: activeModule.name,
        description: activeModule.description,
        tables: activeModule.tables.map((table) => table.id),
      });
    }
  }, [activeModule]);

  const handleEditModule = () => {
    console.log("Editar módulo");
    navigate(`/modulos/${id}`);
  };

  const handleCreateModule = () => {
    console.log(methods.getValues());
    console.log("Criar módulo");
  };

  const actions = {
    create: {
      pageTitle: "Criar módulo",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: handleCreateModule,
    },
    edit: {
      pageTitle: "Editar módulo",
      icon: <Save />,
      buttonLabel: "Salvar",
      onClick: handleEditModule,
    },
    view: {
      pageTitle: "Visualizar módulo",
      icon: <Edit />,
      buttonLabel: "Editar",
      onClick: () => navigate(`/modulos/${id}/editar`),
    },
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <PageTitle
        title={actions[currentAction].pageTitle}
        icon={<Widgets />}
        buttons={[
          <Button
            key="create-module"
            type="button"
            variant="contained"
            color="primary"
            onClick={actions[currentAction].onClick}
            startIcon={actions[currentAction].icon}
          >
            {actions[currentAction].buttonLabel}
          </Button>,
        ]}
      />
      <FormProvider {...methods}>
        <form
          name="module-form"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          <InformationTab />
          <div className="flex flex-col gap-4">
            {isLoadingStructure ? (
              <Skeleton
                variant="rectangular"
                height={400}
                className="rounded-lg"
              />
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
                className="relative"
              >
                {({ zoomIn, zoomOut, centerView }) => (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center justify-between">
                      <h2 className="text-lg font-bold flex flex-row gap-2 items-center">
                        <span className="mb-0.5">
                          <DataObject fontSize="small" />
                        </span>{" "}
                        <span>Esquema</span>
                      </h2>
                      <div className="p-1 flex flex-row justify-between gap-2 border border-[--border] rounded-lg">
                        <div className="flex flex-row gap-4">
                          <Button
                            color="primary"
                            size="small"
                            onClick={() => {
                              centerView();
                            }}
                            startIcon={<CenterFocusStrong />}
                          >
                            Centralizar
                          </Button>
                          <Button
                            color="primary"
                            size="small"
                            onClick={() => {
                              zoomIn();
                            }}
                            startIcon={<ZoomIn />}
                          >
                            Aumentar
                          </Button>
                          <Button
                            color="primary"
                            size="small"
                            onClick={() => {
                              zoomOut();
                            }}
                            startIcon={<ZoomOut />}
                          >
                            Diminuir
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-[62.5vh] overflow-y-hidden border border-[--border] rounded-lg grid-bg relative">
                      <Diagram
                        data={structure}
                        isLoading={isLoadingStructure}
                        allowHover={true}
                        onSelectTable={(table) => {
                          navigate(`/modulos/${id}/${table.id}`, {
                            state: { table },
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </TransformWrapper>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ModuleForm;
