import { Edit, Save, Widgets } from "@mui/icons-material";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Tab } from "@mui/material";
import { createContext, useContext, useState } from "react";
import PageTitle from "../../../layout/components/PageTitle";

import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FieldsTab from "./components/FieldsTab";
import InformationTab from "./components/InformationTab";

const ModuleFormContext = createContext();

export const ModuleForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const { table } = useLocation().state;
  const currentAction = useLocation().pathname.includes("criar")
    ? "create"
    : useLocation().pathname.includes("editar")
      ? "edit"
      : "view";

  return (
    <ModuleFormContext.Provider
      value={{
        table,
        id,
        location,
        currentAction,
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
  const [tab, setTab] = useState("1");
  const navigate = useNavigate();
  const { table, currentAction } = useModuleForm();
  const methods = useForm();
  const handleEditModule = () => {
    console.log("Editar módulo");
    navigate(`/modulos/${table.name}`);
  };

  const handleCreateModule = () => {
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
      onClick: () => navigate(`/modulos/${table.name}/editar`),
    },
  };

  return (
    <div>
      <PageTitle
        title={actions[currentAction].pageTitle}
        icon={<Widgets />}
        buttons={[
          <Button
            key="create-module"
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
        <TabContext value={tab}>
          <TabList onChange={(e, value) => setTab(value)}>
            <Tab label="Informações" value="1" />
            <Tab label="Campos" value="2" />
          </TabList>
          <TabPanel value="1" sx={{ px: 0 }}>
            <InformationTab table={table} />
          </TabPanel>
          <TabPanel value="2" sx={{ px: 0 }}>
            <FieldsTab table={table} />
          </TabPanel>
        </TabContext>
      </FormProvider>
    </div>
  );
};

export default ModuleForm;
