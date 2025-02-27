import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/auth";
import api from "../../services/api";

export default function TaskFilter({
  setAssignments,
  isFetching,
  setIsFetching,
}) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [availableEntities, setAvailableEntities] = useState([]);
  const { user, isLighthouse } = useContext(AuthContext);
  const [filterParams, setFilterParams] = useState({
    assigned_to: null,
    assigned_by: null,
    company: null,
    entity_id: null,
    entity_type: null,
    status: "",
  });

  const entitySearch = async (type) => {
    const response = await api.get(`/entities/${type}`);
    return response.data;
  };

  const fetchAssignments = async () => {
    setIsFetching(true);
    try {
      const params = {
        assigned_to: filterParams.assigned_to || undefined,
        assigned_by: filterParams.assigned_by || undefined,
        company_id: filterParams.company?.id || undefined,
        entity_id: filterParams.entity_id || undefined,
        entity_type: filterParams.entity_type || undefined,
        status: filterParams.status || undefined,
      };
      const response = await api.get("/tasks", { params });
      setAssignments(response?.data?.data);
    } catch (error) {
      console.error("Erro ao obter as atribuições", error);
      toast.error("Erro ao obter as atribuições");
    }
    setIsFetching(false);
  };

  const handleClean = () => {
    setFilterParams({
      assigned_to: null,
      assigned_by: null,
      status: null,
      entity_id: null,
      entity_type: null,
      company: isLighthouse ? null : user.company,
    });
    setAvailableEntities([]);
    fetchAssignments();
  };

  useEffect(() => {
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

    if (isLighthouse) {
      fetchCompanies();
    } else {
      setFilterParams({ ...filterParams, company: user.company.id });
    }

    fetchEntityTypes();
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (filterParams.entity_type) {
      entitySearch(filterParams.entity_type)
        .then((entities) => {
          setAvailableEntities(entities);
        })
        .catch((error) => {
          console.error("Erro ao buscar as entidades", error);
        });
    }
  }, [filterParams.entity_type]);

  useEffect(() => {
    if (filterParams.company) {
      api
        .get(`/users?company_id=${filterParams.company.id}`)
        .then((res) => {
          setAvailableUsers(res.data.data);
        })
        .catch((error) => console.error("Erro ao buscar os usuários", error));
    }
  }, [filterParams.company]);

  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
      {isLighthouse && (
        <Autocomplete
          className="col-span-8"
          value={filterParams.company}
          noOptionsText="Nenhuma empresa encontrada."
          options={availableCompanies}
          getOptionLabel={(option) => option.name}
          loadingText="Carregando..."
          renderInput={(params) => <TextField {...params} label="Empresa" />}
          onChange={(e, newValue) =>
            setFilterParams({ ...filterParams, company: newValue })
          }
        />
      )}
      <Autocomplete
        value={filterParams.assigned_by}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option.id}
        options={availableUsers}
        className="col-span-4"
        noOptionsText="Nenhum usuário disponível."
        loadingText="Carregando..."
        disabled={!filterParams.company}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              !filterParams.company
                ? "Selecione uma empresa para pesquisar"
                : "Atribuído por"
            }
          />
        )}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, assigned_by: newValue })
        }
      />
      <Autocomplete
        value={filterParams.assigned_to}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option.id}
        options={
          filterParams.assigned_by
            ? availableUsers.filter(
                (user) => user.role.nivel > filterParams.assigned_by.role.nivel,
              )
            : availableUsers
        }
        className="col-span-4"
        noOptionsText="Nenhum usuário disponível."
        loadingText="Carregando..."
        disabled={!filterParams.company}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              !filterParams.company
                ? "Selecione uma empresa para pesquisar"
                : "Atribuído para"
            }
          />
        )}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, assigned_to: newValue })
        }
      />
      <Autocomplete
        className="col-span-2"
        value={filterParams.entity_type}
        options={entityTypes}
        noOptionsText="Digite para pesquisar"
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField {...params} label="Tipo de entidade" />
        )}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, entity_type: newValue })
        }
      />
      <Autocomplete
        className="col-span-3"
        value={filterParams.entity_id}
        options={availableEntities}
        noOptionsText="Digite para pesquisar"
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Entidade" />}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, entity_id: newValue })
        }
      />
      <FormControl className="col-span-1">
        <InputLabel id="status">Status</InputLabel>
        <Select
          value={filterParams.status}
          label="Status"
          onChange={(e) =>
            setFilterParams({ ...filterParams, status: e.target.value })
          }
        >
          <MenuItem value="complete">Concluído</MenuItem>
          <MenuItem value="incomplete">Pendente</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleClean} variant="contained" loading={isFetching}>
        Limpar
      </Button>
      <Button
        onClick={() => fetchAssignments()}
        variant="contained"
        loading={isFetching}
      >
        Filtrar
      </Button>
    </div>
  );
}