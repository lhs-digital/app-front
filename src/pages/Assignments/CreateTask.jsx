import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast } from "react-toastify";
import api from "../../services/api";

const CreateTask = ({ open, onClose }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const user = useAuthUser();
  const [entityTypes, setEntityTypes] = useState([]);
  const [availableEntities, setAvailableEntities] = useState([]);

  const [data, setData] = useState({
    assigned_to: null,
    assigned_by: null,
    company: null,
    deadline: null,
    entity_id: null,
    entity_type: null,
    description: null,
  });

  const entitySearch = async () => {
    const response = await api.get(`/entities/${data.entity_type}`);
    return response.data;
  };

  useEffect(() => {
    if (!open) return;
    setIsFetching(true);
    const fetchEntityTypes = async () => {
      try {
        const response = await api.get("/assignables");
        setEntityTypes(response.data);
      } catch (error) {
        console.error("Erro ao buscar os tipos de entidades", error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await api.get("/companies");
        setAvailableCompanies(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar as empresas", error);
      }
    };

    if (user.isLighthouse) {
      fetchCompanies();
    } else {
      setData({ ...data, company: user.company });
    }

    fetchEntityTypes();
    setIsFetching(false);
  }, []);

  useEffect(() => {
    if (data.entity_type) {
      entitySearch()
        .then((entities) => {
          setAvailableEntities(entities);
        })
        .catch((error) => {
          console.error("Erro ao buscar as entidades", error);
        });
    }

    if (data.company) {
      console.log(data.company);
      api
        .get(`/users?company_id=${data.company.id}`)
        .then((res) => {
          setAvailableUsers(res.data.data);
        })
        .catch((error) => console.error("Erro ao buscar os usuários", error));
    }
  }, [data.entity_type, data.company]);

  useEffect(() => {
    api
      .get("/assignables")
      .then((res) => setEntityTypes(res.data))
      .catch((error) => console.error("Erro ao buscar entity types", error));
  }, []);

  const submit = (e) => {
    e.preventDefault();

    api
      .post("/tasks", {
        ...data,
        assigned_to: data.assigned_to.id,
        assigned_by: data.assigned_by.id,
        company_id: data.company.id,
        entity_id: data.entity_id.id,
      })
      .then(() => {
        console.log("Tarefa criada com sucesso");
      })
      .then(() => {
        toast.success("Tarefa criada com sucesso");
        onClose();
      })
      .catch((error) => {
        console.error("Erro ao criar tarefa", error);
        toast.error("Erro ao criar tarefa");
      });
  };

  return (
    <Dialog
      title="Nova tarefa"
      open={open}
      onClose={onClose}
      aria-labelledby="modal-criar-tarefa"
      aria-describedby="modal-criar-tarefa"
    >
      <DialogTitle>Nova tarefa</DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        <form
          id="create-task-form"
          className="flex flex-col gap-4 pt-2"
          onSubmit={submit}
        >
          {user.isLighthouse && (
            <Autocomplete
              fullWidth
              options={availableCompanies}
              noOptionsText="Nenhuma empresa encontrada"
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.id}
              loading={isFetching}
              loadingText="Carregando..."
              renderInput={(params) => (
                <TextField {...params} label="Empresa" />
              )}
              value={data.company_id}
              onChange={(e, newValue) =>
                setData({ ...data, company: newValue })
              }
            />
          )}
          <Autocomplete
            fullWidth
            options={availableUsers}
            noOptionsText="Nenhum usuário encontrado"
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            loading={isFetching}
            loadingText="Carregando..."
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  !data.company
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
            loading={isFetching}
            loadingText="Carregando..."
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  !data.company
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
            loading={isFetching}
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
            loading={isFetching}
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
          <TextField
            type="text"
            name="description"
            multiline
            minRows={2}
            label="Descrição"
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
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
