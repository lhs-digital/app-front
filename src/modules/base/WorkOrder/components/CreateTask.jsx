import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast } from "react-toastify";
import { useCompany } from "../../../../hooks/useCompany";
import api from "../../../../services/api";
import { qc } from "../../../../services/queryClient";
const CreateTask = ({ open, onClose }) => {
  const { company, setCompany, availableCompanies } = useCompany();
  const user = useAuthUser();

  const [data, setData] = useState({
    assigned_to: null,
    assigned_by: null,
    deadline: "",
    entity_id: null,
    entity_type: null,
    description: "",
  });

  const { data: entityTypes = [], isLoading } = useQuery({
    queryKey: ["entityTypes"],
    queryFn: async () => {
      const response = await api.get("/assignables");
      return response.data;
    },
  });

  const { data: availableUsers = [] } = useQuery({
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

  const { data: availableEntities = [] } = useQuery({
    queryKey: ["availableEntities", data.entity_type],
    queryFn: async () => {
      const response = await api.get(`/entities/${data.entity_type}`);
      console.log(response.data);
      return response.data;
    },
    enabled: !!data.entity_type,
  });

  const submit = (e) => {
    e.preventDefault();

    api
      .post("/work_order", {
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
          {user.isLighthouse && (
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
          )}
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
          <Autocomplete
            fullWidth
            options={entityTypes}
            noOptionsText="Nenhum tipo encontrado"
            getOptionLabel={(option) => option}
            loading={isLoading}
            loadingText="Carregando..."
            renderInput={(params) => (
              <TextField {...params} label="Tipo de entidade" />
            )}
            value={data.entity_type}
            onChange={(e, newValue) =>
              setData({ ...data, entity_type: newValue })
            }
          />
          <Autocomplete
            fullWidth
            options={availableEntities}
            noOptionsText="Nenhuma entidade encontrada"
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            loading={isLoading}
            loadingText="Carregando..."
            renderInput={(params) => <TextField {...params} label="Entidade" />}
            value={data.entity_id}
            onChange={(e, newValue) =>
              setData({ ...data, entity_id: newValue })
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
