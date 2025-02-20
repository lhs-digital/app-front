import { Add, ContentPaste } from "@mui/icons-material";
import {
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
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [isCompleted, setIsCompleted] = useState("");
  const [status, setStatus] = useState("");
  const [filterParams, setFilterParams] = useState({
    assigned_to: "",
    assigned_by: "",
    is_completed: "",
    status: "",
  });

  const handleFilter = () => {
    setFilterParams({
      assigned_to: assignedTo,
      assigned_by: assignedBy,
      is_completed: isCompleted,
      status,
    });
  };

  const handleClean = () => {
    setAssignedTo("");
    setAssignedBy("");
    setIsCompleted("");
    setStatus("");
    setFilterParams({
      assigned_to: "",
      assigned_by: "",
      is_completed: "",
      status: "",
    });
  };

  useEffect(() => {
    const getData = async () => {
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

    getData();
    console.log("assignments", assignments);
  }, [filterParams]);

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
        <TextField
          className="col-span-2"
          label="Atribuído para"
          size="small"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
        <TextField
          className="col-span-2"
          label="Atribuído por"
          size="small"
          value={assignedBy}
          onChange={(e) => setAssignedBy(e.target.value)}
        />
        <TextField className="col-span-1" label="Empresa" size="small" />
        <FormControl className="col-span-1">
          <InputLabel id="demo-simple-select-label" size="small">
            Status
          </InputLabel>
          <Select
            value={isCompleted}
            size="small"
            label="Status"
            onChange={(e) => setIsCompleted(e.target.value)}
            placeholder="Status"
          >
            <MenuItem value="true" onClick={() => setIsCompleted("true")}>
              Concluído
            </MenuItem>
            <MenuItem value="false" onClick={() => setIsCompleted("false")}>
              Pendente
            </MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleClean} size="small" variant="contained">
          Limpar
        </Button>
        <Button onClick={handleFilter} size="small" variant="contained">
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
