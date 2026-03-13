import { FilterAltOff } from "@mui/icons-material";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAssignmentFilters } from "../../../../hooks/useAssignmentFilters";
import { useCompany } from "../../../../hooks/useCompany";
import { useUserState } from "../../../../hooks/useUserState";
import api from "../../../../services/api";

export default function TaskFilter({ setAssignments, setQueryState }) {
  const { company } = useCompany();
  const user = useUserState().state;
  const isLighthouse = user.isLighthouse;
  const roleLevel = user.role?.level;
  const showAssignedBy = isLighthouse;
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();
  const { filters, updateFilter, resetFilters, searchParams } =
    useAssignmentFilters();

  // const { data: entityTypes = [] } = useQuery({
  //   queryKey: ["entityTypes", company?.id],
  //   queryFn: async () => {
  //     const response = await api.get("/assignables");
  //     return response.data;
  //   },
  //   enabled: !!company,
  // });

  const entitiesQuery = useQuery({
    queryKey: ["availableEntities", filters.entity_type, company?.id],
    queryFn: async () => {
      const response = await api.get(`/entities/${filters.entity_type}`);
      return response.data;
    },
    enabled: !!filters.entity_type && !!company,
  });

  const usersQuery = useQuery({
    queryKey: ["availableUsers", company?.id],
    queryFn: async () => {
      const response = await api.get(`/users`);
      return response.data.data;
    },
    enabled: !!company,
  });

  useEffect(() => {
    if (usersQuery.data?.length > 0) {
      const assigned_to_id = searchParams.get("assigned_to");
      const assigned_by_id = searchParams.get("assigned_by");

      if (assigned_to_id) {
        const assigned_to = usersQuery.data.find(
          (u) => u.id.toString() === assigned_to_id,
        );
        if (assigned_to) updateFilter("assigned_to", assigned_to);
      }

      if (assigned_by_id) {
        const assigned_by = usersQuery.data.find(
          (u) => u.id.toString() === assigned_by_id,
        );
        if (assigned_by) updateFilter("assigned_by", assigned_by);
      }
    }
  }, [usersQuery.data, searchParams]);

  useEffect(() => {
    if (
      !isLighthouse &&
      roleLevel <= 1 &&
      usersQuery.data?.length > 0 &&
      !filters.assigned_by
    ) {
      const loggedUser = usersQuery.data.find((u) => u.id === user.id);
      if (loggedUser) updateFilter("assigned_by", loggedUser);
    }
  }, [usersQuery.data, filters.assigned_by, isLighthouse, roleLevel, user.id]);

  useEffect(() => {
    if (entitiesQuery.data?.length > 0) {
      const entity_id_param = searchParams.get("entity_id");
      if (entity_id_param) {
        const entity = entitiesQuery.data.find(
          (e) => e.id.toString() === entity_id_param,
        );
        if (entity) updateFilter("entity_id", entity);
      }
    }
  }, [entitiesQuery.data, searchParams]);

  const workOrdersQuery = useQuery({
    queryKey: ["workOrders", company?.id, filters],
    queryFn: async () => {
      const params = {
        assigned_to: filters.assigned_to?.id || undefined,
        assigned_by: filters.assigned_by?.id || undefined,
        company_id: company?.id || undefined,
        entity_id: filters.entity_id?.id || undefined,
        entity_type: filters.entity_type || undefined,
        status: filters.status || undefined,
      };
      const response = await api.get("/work_orders", { params });
      return response.data.data;
    },
    onSettled: () => {
      setQueryState("success");
    },
    onError: (error) => {
      console.error("Erro ao obter as atribuições", error);
      setQueryState("error");
      toast.error("Erro ao obter as atribuições", {
        toastId: "assignmentError",
      });
    },
    enabled: !!company,
  });

  useEffect(() => {
    setAssignments(workOrdersQuery.data ?? []);
  }, [workOrdersQuery.data]);

  useEffect(() => {
    if (
      [usersQuery.state, entitiesQuery.state, workOrdersQuery.state].some(
        (state) => state === "pending",
      )
    ) {
      setQueryState("pending");
    } else if (
      [usersQuery.state, entitiesQuery.state, workOrdersQuery.state].some(
        (state) => state === "error",
      )
    ) {
      setQueryState("error");
    } else {
      setQueryState("success");
    }
  }, [usersQuery.state, entitiesQuery.state, workOrdersQuery.state]);

  const handleClean = () => {
    resetFilters();
    navigate(location.pathname);
    qc.invalidateQueries(["workOrders"]);
  };

  return (
    <div className="mb-4 flex flex-row gap-4">
      {/* {user.isLighthouse && (
        <Autocomplete
          className="col-span-1 md:col-span-2 lg:col-span-8"
          size="small"
          value={company}
          noOptionsText="Nenhuma empresa encontrada."
          options={availableCompanies || []}
          getOptionLabel={(option) => option.name}
          getOptionKey={(option) => option.id}
          loadingText="Carregando..."
          renderInput={(params) => <TextField {...params} label="Empresa" />}
          onChange={(e, newValue) => setCompany(newValue)}
        />
      )} */}
      {showAssignedBy && (
        <Autocomplete
          value={filters.assigned_by}
          getOptionLabel={(option) => option.name}
          getOptionKey={(option) => option.id}
          options={usersQuery.data || []}
          className="grow"
          noOptionsText="Nenhum usuário disponível."
          loadingText="Carregando..."
          disabled={!company || usersQuery.isLoading}
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
          onChange={(e, newValue) => updateFilter("assigned_by", newValue)}
        />
      )}
      <Autocomplete
        value={filters.assigned_to}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option.id}
        options={
          filters.assigned_by && usersQuery.data
            ? usersQuery.data.filter(
                (user) => user.role.nivel > filters.assigned_by.role.nivel,
              )
            : usersQuery.data || []
        }
        className="grow"
        noOptionsText="Nenhum usuário disponível."
        loadingText="Carregando..."
        disabled={!company || usersQuery.isLoading}
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
        onChange={(e, newValue) => updateFilter("assigned_to", newValue)}
      />
      {/* <Autocomplete
        size="small"
        className="col-span-1 md:col-span-2 lg:col-span-2"
        value={filters.entity_type}
        options={entitiesQuery.data || []}
        noOptionsText="Digite para pesquisar"
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <TextField {...params} label="Tipo de entidade" />
        )}
        onChange={(e, newValue) => updateFilter("entity_type", newValue)}
      />
      <Autocomplete
        size="small"
        className="col-span-1 md:col-span-2 lg:col-span-2"
        value={filters.entity_id}
        options={entitiesQuery.data || []}
        noOptionsText="Digite para pesquisar"
        getOptionLabel={(option) => option.name}
        disabled={!filters.entity_type}
        renderInput={(params) => <TextField {...params} label="Entidade" />}
        onChange={(e, newValue) => updateFilter("entity_id", newValue)}
      />
      <FormControl
        className="col-span-1 md:col-span-2 lg:col-span-2"
        size="small"
      >
        <InputLabel id="status">Status</InputLabel>
        <Select
          size="small"
          value={filters.status}
          label="Status"
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="complete">Concluído</MenuItem>
          <MenuItem value="incomplete">Pendente</MenuItem>
        </Select>
      </FormControl> */}
      <Button
        size="small"
        onClick={handleClean}
        disabled={workOrdersQuery.isLoading || usersQuery.isLoading}
        startIcon={<FilterAltOff fontSize="small" />}
      >
        Limpar
      </Button>
    </div>
  );
}
