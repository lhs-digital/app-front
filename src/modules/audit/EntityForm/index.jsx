import { AppRegistration, Save } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import { EntityFormProvider } from "../../../components/DynamicForm/EntityFormContext";
import GenericForm from "../../../components/DynamicForm/GenericForm";
import PageTitle from "../../../layout/components/PageTitle";

const EntityForm = () => {
  const { state } = useLocation();
  return (
    <div className="flex flex-col gap-4 w-full">
      <PageTitle
        title="Item auditado"
        icon={<AppRegistration />}
        buttons={
          state.edit && [
            <Button
              key="submit-form"
              type="submit"
              variant="contained"
              startIcon={<Save />}
            >
              SALVAR
            </Button>,
          ]
        }
        subtitle="Visualização e edição de dos itens auditados"
      />
      <EntityFormProvider>
        <GenericForm />
      </EntityFormProvider>
    </div>
  );
};

export default EntityForm;
