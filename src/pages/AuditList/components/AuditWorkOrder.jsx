import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import WorkOrderForm from "../../../components/WorkOrderForm";
import { useUserState } from "../../../hooks/useUserState";
import api from "../../../services/api";

const AuditWorkOrder = ({ open, onClose, auditRecord, handleView }) => {
  const user = useUserState().state;
  const formRef = useRef(null);
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      assigned_by: "",
      assigned_to: null,
      deadline: "",
      description: "",
    },
  });

  const { data: availableUsers = [], isFetching } = useQuery({
    queryKey: ["availableUsers", user.company],
    queryFn: async () => {
      const response = await api.get("/users", {
        params: {
          company_id: user.company.id,
        },
      });
      const assignables = await api.get("/assignables");
      console.log(assignables.data);
      return response.data.data;
    },
    enabled: !!user.company,
  });

  const { mutate: submitTask, isPending } = useMutation({
    mutationFn: async (data) => {
      await api.post("/work_order", {
        ...data,
        company: user.company.id,
        assigned_to: data.assigned_to.id,
        assigned_by: user.id,
        entity_type: "audit_invalid_record",
        entity_id: auditRecord.id,
      });
    },
    onSuccess: () => {
      toast.success("Ordem de serviço criada com sucesso!");
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response.data.message);
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth scroll="body">
      <DialogTitle>
        {auditRecord?.work_order ? "Detalhes da OS" : "Criar Ordem de Serviço"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {auditRecord?.work_order ? (
          <WorkOrderForm assignment={auditRecord.work_order} />
        ) : (
          <form
            onSubmit={handleSubmit(submitTask)}
            ref={formRef}
            className="flex flex-col gap-4 pt-2"
          >
            <TextField
              type="text"
              name="description"
              multiline
              minRows={2}
              label="Descrição"
              {...register("description", { required: "Campo obrigatório" })}
            />
            <Controller
              name="assigned_to"
              control={control}
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <Autocomplete
                  fullWidth
                  options={availableUsers}
                  noOptionsText="Nenhum usuário encontrado"
                  getOptionLabel={(option) => option.name}
                  getOptionKey={(option) => option.id}
                  loading={isFetching}
                  loadingText="Carregando..."
                  renderInput={(params) => (
                    <TextField {...params} label="Atribuído para" />
                  )}
                  value={field.value}
                  onChange={(e, newValue) => field.onChange(newValue)}
                />
              )}
            />
            <TextField
              type="date"
              label="Prazo"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("deadline", { required: "Campo obrigatório" })}
            />
          </form>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          variant="contained"
          loading={isPending}
          onClick={
            auditRecord?.work_order
              ? () => handleView(auditRecord)
              : handleSubmit(submitTask)
          }
        >
          {auditRecord?.work_order ? "Corrigir" : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuditWorkOrder;
