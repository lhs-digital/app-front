import { MenuItem, Select, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import FormField from "../../../../components/FormField";

const InformationTab = ({ table }) => {
  const { register, control } = useFormContext();
  return (
    <div className="flex flex-col gap-4 w-full">
      <FormField label="Tabela">
        {table ? (
          <TextField fullWidth value={table.name} disabled />
        ) : (
          <Controller
            name="table"
            control={control}
            render={({ field }) => (
              <Select fullWidth {...field}>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
              </Select>
            )}
          />
        )}
      </FormField>
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
