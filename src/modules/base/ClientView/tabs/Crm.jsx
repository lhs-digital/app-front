import { Box, InputLabel, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useClientForm } from "../index";

const Crm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { isEditing, isCreating, auditErrors } = useClientForm();

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
          error={!!auditErrors.vd_canal || !!errors.vd_canal}
          slotProps={{
            input: {
              readOnly: !isEditing && !isCreating,
            },
          }}
          helperText={auditErrors.vd_canal?.message ?? errors.vd_canal?.message}
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
          slotProps={{
            input: {
              readOnly: !isEditing && !isCreating,
            },
          }}
          error={!!auditErrors.concorrente || !!errors.concorrente}
          helperText={
            auditErrors.concorrente?.message ?? errors.concorrente?.message
          }
        />
      </Box>
      <Box className="lg:col-span-3">
        <InputLabel required>Perfil</InputLabel>
        <TextField
          type="text"
          {...register("perfil", { required: "Perfil é obrigatório" })}
          fullWidth
          error={!!auditErrors.perfil || !!errors.perfil}
          slotProps={{
            input: {
              readOnly: !isEditing && !isCreating,
            },
          }}
          helperText={auditErrors.perfil?.message ?? errors.perfil?.message}
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
          slotProps={{
            input: {
              readOnly: !isEditing && !isCreating,
            },
          }}
          error={!!auditErrors.responsavel || !!errors.responsavel}
          helperText={
            auditErrors.responsavel?.message ?? errors.responsavel?.message
          }
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
          slotProps={{
            input: {
              readOnly: !isEditing && !isCreating,
            },
          }}
          error={
            !!auditErrors.planejamento_analitico ||
            !!errors.planejamento_analitico
          }
          helperText={
            auditErrors.planejamento_analitico?.message ??
            errors.planejamento_analitico?.message
          }
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
          slotProps={{
            input: {
              readOnly: !isEditing && !isCreating,
            },
          }}
          error={
            !!auditErrors.planejamento_analitico ||
            !!errors.planejamento_analitico
          }
          helperText={
            auditErrors.planejamento_analitico?.message ??
            errors.planejamento_analitico?.message
          }
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
          slotProps={{
            input: {
              readOnly: !isEditing && !isCreating,
            },
          }}
          error={!!auditErrors.vendedor || !!errors.vendedor}
          helperText={auditErrors.vendedor?.message ?? errors.vendedor?.message}
        />
      </Box>
    </div>
  );
};

export default Crm;
