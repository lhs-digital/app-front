import { MenuItem, Select, TextField } from "@mui/material";
import FormField from "../../../../components/FormField";

const InformationTab = ({ table }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <FormField label="Tabela">
        {table ? (
          <TextField fullWidth value={table.name} disabled />
        ) : (
          <Select fullWidth>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
          </Select>
        )}
      </FormField>
      <FormField label="Nome do módulo">
        <TextField fullWidth />
      </FormField>
      <FormField label="Descrição do módulo">
        <TextField multiline rows={3} fullWidth />
      </FormField>
    </div>
  );
};

export default InformationTab;
