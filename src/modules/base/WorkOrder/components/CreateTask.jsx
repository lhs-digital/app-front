import {
  Autocomplete,
  Button,
  Chip,
  colors,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useThemeMode } from "../../../../contexts/themeModeContext";
import { useCompany } from "../../../../hooks/useCompany";
import api from "../../../../services/api";
import { qc } from "../../../../services/queryClient";
import {
  formattedPriority,
  getPriorityColor,
} from "../../../../services/utils";
import { handleMode } from "../../../../theme";
const CreateTask = ({ open, onClose, auditRecord }) => {
  const { company } = useCompany();
  const theme = handleMode(useThemeMode().mode);

  const [data, setData] = useState({
    assigned_to: null,
    assigned_by: null,
    deadline: "",
    entity_id: null,
    entity_type: null,
    description: "",
  });

  const { data: availableUsers = [], isLoading } = useQuery({
    queryKey: ["availableUsers", company?.id],
    queryFn: async () => {
      const response = await api.get("/users", {
        params: {
          company_id: company?.id,
        },
      });
      return response.data.data;
    },
    enabled: !!company,
  });

  useEffect(() => {
    if (auditRecord) {
      setData({
        ...data,
        entity_id: auditRecord.id,
        entity_type: "audit_invalid_record",
      });
    }
  }, [auditRecord]);

  const submit = (e) => {
    e.preventDefault();

    api
      .post("/work_orders", {
        ...data,
        assigned_to: data.assigned_to.id,
        assigned_by: data.assigned_by.id,
        company_id: company?.id,
        entity_id: data.entity_id.id,
      })
      .then(() => {
        toast.success("Tarefa criada com sucesso");
        onClose();
      })
      .catch((error) => {
        console.error("Erro ao criar tarefa", error);
        toast.error("Erro ao criar tarefa");
      })
      .finally(() => {
        qc.invalidateQueries(["workOrders"]);
      });
  };

  return (
    <Dialog
      title="Nova tarefa"
      open={open}
      onClose={onClose}
      scroll="body"
      maxWidth="sm"
      fullWidth
      aria-labelledby="modal-criar-tarefa"
      aria-describedby="modal-criar-tarefa"
    >
      <DialogTitle>Nova ordem de serviço</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        {auditRecord && (
          <div className="flex flex-col gap-2 p-4 border border-neutral-300 dark:border-neutral-700 rounded-xl">
            <div className="flex flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <p className="text-lg">
                  # AUD{auditRecord?.id.toString().padStart(3, "0")}
                </p>
              </div>
              <Chip
                size="small"
                label={formattedPriority(auditRecord?.priority)}
                sx={getPriorityColor(auditRecord?.priority, theme)}
                variant={theme === "dark" ? "outlined" : "filled"}
              />
            </div>
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm">
                Campos inválidos{" "}
                <span
                  style={{
                    color:
                      theme === "light" ? colors.red[500] : colors.red[400],
                  }}
                >
                  ({auditRecord?.columns.length})
                </span>
                :{" "}
              </p>
              {auditRecord?.columns.slice(0, 2).map((col, index) => (
                <Chip
                  key={index}
                  size="small"
                  variant="outlined"
                  label={col?.label}
                  sx={{
                    color: getPriorityColor(col?.priority, theme).color,
                  }}
                />
              ))}
              {auditRecord?.columns.length > 2 && (
                <Tooltip
                  title={auditRecord?.columns
                    .slice(2)
                    .map((col) => col?.label)
                    .join(", ")}
                  aria-label="Mais campos"
                >
                  <div className="flex flex-col items-center justify-center bg-neutral-300 dark:bg-neutral-700 aspect-square rounded-full px-1 text-xs">
                    <p className="mr-0.5">+{auditRecord?.columns.length - 2}</p>
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        )}
        <form
          id="create-task-form"
          className="flex flex-col gap-6 pt-2"
          onSubmit={submit}
        >
          <TextField
            type="text"
            name="description"
            multiline
            minRows={2}
            label="Descrição"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
          />
          {/* {user.isLighthouse && (
            <Autocomplete
              className="col-span-8"
              value={company}
              noOptionsText="Nenhuma empresa encontrada."
              options={availableCompanies}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.id}
              loadingText="Carregando..."
              renderInput={(params) => (
                <TextField {...params} label="Empresa" />
              )}
              onChange={(e, newValue) => setCompany(newValue)}
            />
          )} */}
          <Autocomplete
            fullWidth
            options={availableUsers}
            noOptionsText="Nenhum usuário encontrado"
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            loading={isLoading}
            loadingText="Carregando..."
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  !company
                    ? "Selecione uma empresa para pesquisar"
                    : "Atribuído por"
                }
              />
            )}
            value={data.assigned_by}
            onChange={(e, newValue) =>
              setData({ ...data, assigned_by: newValue })
            }
          />
          <Autocomplete
            fullWidth
            options={
              data.assigned_by
                ? availableUsers.filter(
                    (user) => user.role.nivel > data.assigned_by.role.nivel,
                  )
                : availableUsers
            }
            noOptionsText="Nenhum usuário encontrado"
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            loading={isLoading}
            loadingText="Carregando..."
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  !company
                    ? "Selecione uma empresa para pesquisar"
                    : "Atribuído para"
                }
              />
            )}
            value={data.assigned_to}
            onChange={(e, newValue) =>
              setData({ ...data, assigned_to: newValue })
            }
          />
          <TextField
            type="date"
            name="deadline"
            label="Prazo"
            slotProps={{ inputLabel: { shrink: true } }}
            value={data.deadline}
            onChange={(e) => setData({ ...data, deadline: e.target.value })}
          />
        </form>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            form="create-task-form"
            onClick={submit}
          >
            Salvar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
