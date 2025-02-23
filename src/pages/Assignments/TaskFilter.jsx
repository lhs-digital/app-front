import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/api";

export default function TaskFilter({
  setAssignments,
  isFetching,
  setIsFetching,
}) {
  const [availableUsersTo, setAvailableUsersTo] = useState([]);
  const [availableUsersBy, setAvailableUsersBy] = useState([]);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [searchAssignedTo, setSearchAssignedTo] = useState(null);
  const [searchAssignedBy, setSearchAssignedBy] = useState(null);
  const [searchCompany, setSearchCompany] = useState(null);
  const [filterParams, setFilterParams] = useState({
    assigned_to: null,
    assigned_by: null,
    company: null,
    entity_id: null,
    entity_type: null,
    status: "",
  });
  const debouncedAssignedTo = useDebounce(searchAssignedTo, 500);
  const debouncedAssignedBy = useDebounce(searchAssignedBy, 500);
  const debouncedCompany = useDebounce(searchCompany, 500);
  const [searchFetching, setSearchFetching] = useState(false);
  const [entityTypes, setEntityTypes] = useState([]);
  const [availableEntities, setAvailableEntities] = useState([]);

  const companySearch = async (search) => {
    const response = await api.get(`/companies?search=${search}`);
    return response.data.data;
  };

  const userSearch = async (search) => {
    const response = await api.get(`/users?search=${search}`);
    return response.data.data;
  };

  const entitySearch = async (type) => {
    const response = await api.get(`/entities/${type}`);
    return response.data;
  };

  const fetchAssignments = async () => {
    setIsFetching(true);
    try {
      console.log(filterParams);
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
      company: null,
      entity_id: null,
      entity_type: null,
    });
    setAvailableCompanies([]);
    setAvailableEntities([]);
    setSearchAssignedTo(null);
    setSearchAssignedBy(null);
    setSearchCompany(null);
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
    fetchEntityTypes();
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (debouncedAssignedTo && debouncedAssignedTo.length > 2) {
      setSearchFetching(true);
      userSearch(debouncedAssignedTo)
        .then((users) => {
          setAvailableUsersTo(users);
          setSearchFetching(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar os usuários", error);
        });
    } else {
      setAvailableUsersTo([]);
    }

    if (debouncedAssignedBy && debouncedAssignedBy.length > 2) {
      setSearchFetching(true);
      userSearch(debouncedAssignedBy)
        .then((users) => {
          setAvailableUsersBy(users);
          setSearchFetching(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar os usuários", error);
        });
    } else {
      setAvailableUsersBy([]);
    }

    if (debouncedCompany && debouncedCompany.length > 2) {
      setSearchFetching(true);
      companySearch(debouncedCompany)
        .then((companies) => {
          setAvailableCompanies(companies);
          setSearchFetching(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar as empresas", error);
        });
    } else {
      setAvailableCompanies([]);
    }

    if (filterParams.entity_type) {
      entitySearch(filterParams.entity_type)
        .then((entities) => {
          console.log("entities", entities);
          setAvailableEntities(entities);
        })
        .catch((error) => {
          console.error("Erro ao buscar as entidades", error);
        });
    }

    setSearchFetching(false);
  }, [
    debouncedAssignedTo,
    debouncedAssignedBy,
    debouncedCompany,
    filterParams.entity_type,
  ]);

  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
      <Autocomplete
        filterOptions={(x) => x}
        value={filterParams.assigned_to}
        inputValue={searchAssignedTo || ""}
        getOptionKey={(option) => option.id}
        getOptionLabel={(option) => option.name}
        onInputChange={(e, value) => setSearchAssignedTo(value)}
        options={availableUsersTo}
        className="col-span-4"
        noOptionsText="Digite para pesquisar"
        loadingText="Carregando..."
        size="small"
        loading={searchFetching}
        renderInput={(params) => (
          <TextField {...params} label="Atribuído para" />
        )}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, assigned_to: newValue })
        }
      />
      <Autocomplete
        filterOptions={(x) => x}
        className="col-span-4"
        value={filterParams.assigned_by}
        inputValue={searchAssignedBy || ""}
        noOptionsText="Digite para pesquisar"
        onInputChange={(e, value) => setSearchAssignedBy(value)}
        size="small"
        loading={searchFetching}
        loadingText="Carregando..."
        options={availableUsersBy}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Atribuído por" />
        )}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, assigned_by: newValue })
        }
      />
      <Autocomplete
        className="col-span-2"
        value={filterParams.entity_type}
        options={entityTypes}
        noOptionsText="Digite para pesquisar"
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField {...params} label="Tipo de entidade" size="small" />
        )}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, entity_type: newValue })
        }
      />
      <Autocomplete
        className="col-span-6"
        value={filterParams.entity_id}
        options={availableEntities}
        noOptionsText="Digite para pesquisar"
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Entidade" size="small" />
        )}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, entity_id: newValue })
        }
      />
      <Autocomplete
        className="col-span-4"
        value={filterParams.company}
        inputValue={searchCompany || ""}
        noOptionsText="Digite para pesquisar"
        filterOptions={(x) => x}
        options={availableCompanies}
        getOptionLabel={(option) => option.name}
        loading={searchFetching}
        loadingText="Carregando..."
        onInputChange={(e, value) => setSearchCompany(value)}
        renderInput={(params) => (
          <TextField {...params} label="Empresa" size="small" />
        )}
        onChange={(e, newValue) =>
          setFilterParams({ ...filterParams, company: newValue })
        }
      />
      <FormControl className="col-span-2">
        <InputLabel id="status" size="small">
          Status
        </InputLabel>
        <Select
          value={filterParams.status}
          size="small"
          label="Status"
          onChange={(e) =>
            setFilterParams({ ...filterParams, status: e.target.value })
          }
        >
          <MenuItem value="complete">Concluído</MenuItem>
          <MenuItem value="incomplete">Pendente</MenuItem>
        </Select>
      </FormControl>
      <Button
        onClick={handleClean}
        size="small"
        variant="contained"
        disabled={searchFetching}
        loading={isFetching}
      >
        Limpar
      </Button>
      <Button
        onClick={() => fetchAssignments()}
        size="small"
        variant="contained"
        disabled={searchFetching}
        loading={isFetching}
      >
        Filtrar
      </Button>
    </div>
  );
}
