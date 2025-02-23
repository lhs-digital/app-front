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
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/api";

const CreateTask = ({ open, onClose }) => {
  const [searchAssignedTo, setSearchAssignedTo] = useState("");
  const [searchAssignedBy, setSearchAssignedBy] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  const debouncedAssignedTo = useDebounce(searchAssignedTo, 500);
  const debouncedAssignedBy = useDebounce(searchAssignedBy, 500);
  const debouncedCompany = useDebounce(searchCompany, 500);

  const [availableUsersTo, setAvailableUsersTo] = useState([]);
  const [availableUsersBy, setAvailableUsersBy] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const [entityTypes, setEntityTypes] = useState([]);
  const [availableEntities, setAvailableEntities] = useState([]);

  const [data, setData] = useState({
    assigned_to: null,
    assigned_by: null,
    company_id: null,
    deadline: null,
    entity_id: null,
    entity_type: null,
    description: null,
  });

  const lazyUserSearch = async (search) => {
    const response = await api.get(`/users?search=${search}`);
    return response.data.data;
  };

  const lazyCompanySearch = async (search) => {
    const response = await api.get(`/companies?search=${search}`);
    return response.data.data;
  };

  const entitySearch = async () => {
    const response = await api.get(`/entities/${data.entity_type}`);
    return response.data;
  };

  useEffect(() => {
    if (debouncedAssignedTo && debouncedAssignedTo.length > 2) {
      setIsFetching(true);
      lazyUserSearch(debouncedAssignedTo)
        .then((data) => {
          setAvailableUsersTo(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar os usuários", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setAvailableUsersTo([]);
    }

    if (debouncedAssignedBy && debouncedAssignedBy.length > 2) {
      setIsFetching(true);
      lazyUserSearch(debouncedAssignedBy)
        .then((data) => {
          setAvailableUsersBy(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar os usuários", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setAvailableUsersBy([]);
    }

    if (debouncedCompany && debouncedCompany.length > 2) {
      setIsFetching(true);
      lazyCompanySearch(debouncedCompany)
        .then((data) => {
          setAvailableCompanies(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar as empresas", error);
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setAvailableCompanies([]);
    }
  }, [debouncedAssignedTo, debouncedAssignedBy, debouncedCompany]);

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
  }, [data.entity_type]);

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
        company_id: data.company_id.id,
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
          <Autocomplete
            fullWidth
            filterOptions={(x) => x}
            options={availableUsersTo}
            noOptionsText="Nenhum usuário encontrado"
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            loading={isFetching}
            loadingText="Carregando..."
            onInputChange={(e, value) => setSearchAssignedTo(value)}
            renderInput={(params) => (
              <TextField {...params} label="Atribuído para" />
            )}
            value={data.assigned_to}
            onChange={(e, newValue) =>
              setData({ ...data, assigned_to: newValue })
            }
          />
          <Autocomplete
            filterOptions={(x) => x}
            fullWidth
            options={availableUsersBy}
            noOptionsText="Nenhum usuário encontrado"
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            loading={isFetching}
            loadingText="Carregando..."
            onInputChange={(e, value) => setSearchAssignedBy(value)}
            renderInput={(params) => (
              <TextField {...params} label="Atribuído por" />
            )}
            value={data.assigned_by}
            onChange={(e, newValue) =>
              setData({ ...data, assigned_by: newValue })
            }
          />
          <Autocomplete
            fullWidth
            filterOptions={(x) => x}
            options={availableCompanies}
            noOptionsText="Nenhuma empresa encontrada"
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            loading={isFetching}
            loadingText="Carregando..."
            onInputChange={(e, value) => setSearchCompany(value)}
            renderInput={(params) => <TextField {...params} label="Empresa" />}
            value={data.company_id}
            onChange={(e, newValue) =>
              setData({ ...data, company_id: newValue })
            }
          />
          <Autocomplete
            fullWidth
            filterOptions={(x) => x}
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
            filterOptions={(x) => x}
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
