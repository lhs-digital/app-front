import { Box, InputLabel, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useClientForm } from "..";

const Complementary = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { isEditing, isCreating } = useClientForm();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box className="lg:col-span-4">
        <InputLabel required>Nome do pai</InputLabel>
        <TextField
          type="text"
          {...register("nome_pai", {
            required: "Nome do pai é obrigatório",
          })}
          fullWidth
          error={!!errors.nome_pai}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.nome_pai?.message}
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Nome da mãe</InputLabel>
        <TextField
          type="text"
          {...register("nome_mae", {
            required: "Nome da mãe é obrigatório",
          })}
          fullWidth
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          error={!!errors.nome_mae}
          helperText={errors.nome_mae?.message}
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Representante legal</InputLabel>
        <TextField
          type="text"
          {...register("representante_legal", {
            required: "Representante legal é obrigatório",
          })}
          fullWidth
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          error={!!errors.representante_legal}
          helperText={errors.representante_legal?.message}
        />
      </Box>
    </div>
  );
};

export default Complementary;
