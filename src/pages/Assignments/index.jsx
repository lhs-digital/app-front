import { Add, ContentPaste } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import api from "../../services/api";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [availableUsersTo, setAvailableUsersTo] = useState([]);
  const [availableUsersBy, setAvailableUsersBy] = useState([]);
  const [searchAssignedTo, setSearchAssignedTo] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [searchAssignedBy, setSearchAssignedBy] = useState(null);
  const [filterParams, setFilterParams] = useState({
    assigned_to: null,
    assigned_by: null,
    status: "",
  });

  const fetchAssignments = async () => {
    try {
      const params = {
        assigned_to: filterParams.assigned_to || undefined,
        assigned_by: filterParams.assigned_by || undefined,
        is_completed: filterParams.is_completed || undefined,
        status: filterParams.status || undefined,
      };
      const response = await api.get("/tasks", { params });
      console.log(response.data.data);
      setAssignments(response?.data?.data);
    } catch (error) {
      console.error("Erro ao obter as atribuições", error);
    }
  };

  const handleClean = () => {
    setFilterParams({
      assigned_to: "",
      assigned_by: "",
      is_completed: "",
      status: "",
    });
  };

  const lazyUserSearch = async (search) => {
    const response = await api.get(`/users?search=${search}`);
    return response.data.data;
  };

  const fetchUsersForAssignedTo = async (search) => {
    setIsFetching(true);
    try {
      const data = await lazyUserSearch(search);
      setAvailableUsersTo(data);
    } catch (error) {
      console.error("Erro ao buscar usuários To", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchUsersForAssignedBy = async (search) => {
    setIsFetching(true);
    try {
      const data = await lazyUserSearch(search);
      setAvailableUsersBy(data);
    } catch (error) {
      console.error("Erro ao buscar usuários By", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (searchAssignedTo && searchAssignedTo.length > 2) {
      fetchUsersForAssignedTo(searchAssignedTo);
    } else {
      setAvailableUsersTo([]);
    }
    if (searchAssignedBy && searchAssignedBy.length > 2) {
      fetchUsersForAssignedBy(searchAssignedBy);
    } else {
      setAvailableUsersBy([]);
    }
  }, [searchAssignedTo, searchAssignedBy]);

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Atribuições"
        icon={<ContentPaste />}
        buttons={[
          <Button key="add-task" variant="contained" startIcon={<Add />}>
            Nova task
          </Button>,
        ]}
      />
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        <Autocomplete
          filterOptions={(x) => x}
          value={filterParams.assigned_to}
          inputValue={searchAssignedTo || ""}
          getOptionKey={(option) => option.id}
          getOptionLabel={(option) => option.name}
          onInputChange={(e, value) => setSearchAssignedTo(value)}
          options={availableUsersTo}
          className="col-span-2"
          placeholder="Digite para pesquisar"
          noOptionsText="Nenhum usuário encontrado"
          loadingText="Carregando..."
          size="small"
          loading={isFetching}
          renderInput={(params) => (
            <TextField {...params} label="Atribuído para" />
          )}
          onChange={(e, newValue) =>
            setFilterParams({
              ...filterParams,
              assigned_to: newValue,
            })
          }
        />
        <Autocomplete
          placeholder="Digite para pesquisar"
          filterOptions={(x) => x}
          className="col-span-2"
          value={filterParams.assigned_by}
          inputValue={searchAssignedBy || ""}
          noOptionsText="Nenhum usuário encontrado"
          onInputChange={(e, value) => setSearchAssignedBy(value)}
          size="small"
          loading={isFetching}
          loadingText="Carregando..."
          options={availableUsersBy}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField {...params} label="Atribuído por" />
          )}
          onChange={(e, newValue) =>
            setFilterParams({
              ...filterParams,
              assigned_by: newValue,
            })
          }
        />
        <TextField className="col-span-1" label="Empresa" size="small" />
        <FormControl className="col-span-1">
          <InputLabel id="demo-simple-select-label" size="small">
            Status
          </InputLabel>
          <Select
            value={filterParams.status}
            size="small"
            label="Status"
            onChange={(e) =>
              setFilterParams({
                ...filterParams,
                status: e.target.value,
              })
            }
            placeholder="Status"
          >
            <MenuItem value="true">Concluído</MenuItem>
            <MenuItem value="false">Pendente</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleClean} size="small" variant="contained">
          Limpar
        </Button>
        <Button
          onClick={() => fetchAssignments()}
          size="small"
          variant="contained"
        >
          Filtrar
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} variant="outlined">
            <CardHeader title={assignment.entity_type} />
            <CardContent className="flex flex-col gap-2">
              <p>Descrição: {assignment.description}</p>
              <p>Empresa: {assignment.company.name}</p>
              <p>Atribuído por: {assignment.assigned_by.name}</p>
              <p>Atribuído para: {assignment.assigned_to.name}</p>
              <p>
                Deadline:{" "}
                {new Date(assignment.deadline).toLocaleDateString("pt-Br")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
