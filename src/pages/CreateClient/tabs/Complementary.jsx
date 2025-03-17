import { Box, InputLabel, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const Complementary = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box className="lg:col-span-4">
        <InputLabel required>Nome do pai</InputLabel>
        <TextField
          type="text"
          {...register("father_name", {
            required: "Nome do pai é obrigatório",
          })}
          fullWidth
          error={!!errors.father_name}
          helperText={errors.father_name?.message}
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Nome da mãe</InputLabel>
        <TextField
          type="text"
          {...register("mother_name", {
            required: "Nome da mãe é obrigatório",
          })}
          fullWidth
          error={!!errors.mother_name}
          helperText={errors.mother_name?.message}
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Representante legal</InputLabel>
        <TextField
          type="text"
          {...register("legal_representative", {
            required: "Representante legal é obrigatório",
          })}
          fullWidth
          error={!!errors.legal_representative}
          helperText={errors.legal_representative?.message}
        />
      </Box>
    </div>
  );
};

export default Complementary;