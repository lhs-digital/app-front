import { Box, InputLabel, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import InputMask from "react-input-mask";
import { useClientForm } from "..";

const Contact = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { isEditing, isCreating } = useClientForm();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box className="lg:col-span-4">
        <InputLabel required>E-mail</InputLabel>
        <TextField
          type="email"
          {...register("email", {
            required: "E-mail é obrigatório",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "E-mail inválido",
            },
          })}
          fullWidth
          error={!!errors.email}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.email?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Celular</InputLabel>
        <InputMask
          mask="(99) 9 9999-9999"
          maskChar=" "
          {...register("telefone_celular", {
            required: "Celular é obrigatório",
          })}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              fullWidth
              error={!!errors.telefone_celular}
              helperText={errors.telefone_celular?.message}
              InputProps={{
                readOnly: !isEditing && !isCreating,
              }}
              type="text"
            />
          )}
        </InputMask>
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Whatsapp</InputLabel>
        <InputMask
          mask="(99) 9 9999-9999"
          maskChar=" "
          {...register("whatsapp", { required: "Whatsapp é obrigatório" })}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              fullWidth
              error={!!errors.whatsapp}
              helperText={errors.whatsapp?.message}
              InputProps={{
                readOnly: !isEditing && !isCreating,
              }}
              type="text"
            />
          )}
        </InputMask>
      </Box>
    </div>
  );
};

export default Contact;
