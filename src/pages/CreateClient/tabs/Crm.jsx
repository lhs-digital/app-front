import { Box, InputLabel, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useClientForm } from "..";

const Crm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { isEditing, isCreating } = useClientForm();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box className="lg:col-span-3">
        <InputLabel required>Canal de vendas</InputLabel>
        <TextField
          type="text"
          {...register("vd_canal", {
            required: "Canal de vendas é obrigatório",
          })}
          fullWidth
          error={!!errors.vd_canal}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.vd_canal?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Concorrente</InputLabel>
        <TextField
          type="text"
          {...register("concorrente", {
            required: "Concorrente é obrigatório",
          })}
          fullWidth
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          error={!!errors.concorrente}
          helperText={errors.concorrente?.message}
        />
      </Box>
      <Box className="lg:col-span-3">
        <InputLabel required>Perfil</InputLabel>
        <TextField
          type="text"
          {...register("perfil", { required: "Perfil é obrigatório" })}
          fullWidth
          error={!!errors.perfil}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.perfil?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Responsável</InputLabel>
        <TextField
          type="text"
          {...register("responsavel", {
            required: "Responsável é obrigatório",
          })}
          fullWidth
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          error={!!errors.responsavel}
          helperText={errors.responsavel?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Planejamento analítico</InputLabel>
        <TextField
          type="text"
          {...register("planejamento_analitico", {
            required: "Planejamento analítico é obrigatório",
          })}
          fullWidth
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          error={!!errors.planejamento_analitico}
          helperText={errors.planejamento_analitico?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Condição de pagamentos</InputLabel>
        <TextField
          type="text"
          {...register("cond_pagamento", {
            required: "Condição de pagamentos é obrigatória",
          })}
          fullWidth
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          error={!!errors.planejamento_analitico}
          helperText={errors.planejamento_analitico?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Vendedor padrão</InputLabel>
        <TextField
          type="text"
          {...register("vendedor", {
            required: "Vendedor padrão é obrigatório",
          })}
          fullWidth
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          error={!!errors.vendedor}
          helperText={errors.vendedor?.message}
        />
      </Box>
    </div>
  );
};

export default Crm;
