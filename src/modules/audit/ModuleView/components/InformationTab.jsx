import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import FormField from "../../../../components/FormField";

const InformationTab = () => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-4 w-full">
      <FormField label="Nome do módulo">
        <TextField fullWidth {...register("name")} />
      </FormField>
      <FormField label="Descrição do módulo">
        <TextField multiline rows={3} fullWidth {...register("description")} />
      </FormField>
    </div>
  );
};

export default InformationTab;
