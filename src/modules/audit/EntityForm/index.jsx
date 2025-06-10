import { AppRegistration, Save } from "@mui/icons-material";
import { Button } from "@mui/material";
import { EntityFormProvider } from "../../../components/DynamicForm/EntityFormContext";
import GenericForm from "../../../components/DynamicForm/GenericForm";
import PageTitle from "../../../layout/components/PageTitle";

const EntityForm = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <PageTitle
        title="Entidade"
        icon={<AppRegistration />}
        buttons={[
          <Button
            key="submit-form"
            type="submit"
            variant="contained"
            startIcon={<Save />}
          >
            SALVAR
          </Button>,
        ]}
        subtitle="Visualização e edição de entidades"
      />
      <EntityFormProvider>
        <GenericForm />
      </EntityFormProvider>
    </div>
  );
};

export default EntityForm;
