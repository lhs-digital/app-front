import { CalendarToday, OpenInNew, Person } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../services/api";
import { moduleEndpoints, moduleRoutes } from "../../../../services/moduleRoutes";
import { qc } from "../../../../services/queryClient";
import { statusInfo, taskStatuses } from "../utils";

const ViewTask = ({ assignment, open, onClose }) => {
  console.log("assignment", assignment);
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState(
    assignment?.status || "not_started",
  );
  const [pendingStatus, setPendingStatus] = useState("");

  useEffect(() => {
    setSelectedStatus(assignment?.status || "not_started");
  }, [assignment]);

  const fetchEntityDetails = async (path, id) => {
    try {
      const response = await api.get(`/${path}/${id}`);
      return response.data.data;
    } catch (error) {
      if (error.response.status === 404) {
        return toast.error("Entidade não encontrada");
      }
      if (error.response.status === 500) {
        return toast.error("Erro interno do servidor");
      }
      if (error.response.status === 401) {
        return toast.error("Não autorizado");
      }
      if (error.response.status === 403) {
        return toast.error("Acesso negado");
      }
    }
  };

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async (data) => {
      setPendingStatus(data.status);
      await api.put(`/work_order/${assignment.id}/status`, data);
    },
    onSuccess: () => {
      qc.invalidateQueries(["work_orders"]);
      setSelectedStatus(pendingStatus);
      setPendingStatus("");
    },
  });

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    updateStatus({ status: newStatus });
  };

  const handleView = (auditRecord) => {
    console.log("auditRecord", auditRecord);
    const navigateRoute = [];

    navigateRoute.push(moduleRoutes[auditRecord?.table.name]);
    navigateRoute.push(auditRecord?.record_id);
    console.log("navigateRoute", navigateRoute);

    return navigate(`/${navigateRoute.join("/")}`, {
      state: {
        edit: true,
        columns: auditRecord?.columns,
        recordId: Number(auditRecord?.id),
        status: auditRecord?.status,
        companyId: assignment.company?.id,
      },
    });
  };

  const handleEntity = async () => {
    const response = await fetchEntityDetails(
      moduleEndpoints[assignment.entity_type].show,
      assignment.entity_id,
    );
    if (response) {
      handleView(response);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Visualizar Tarefa"
      scroll="body"
    >
      <DialogContent className="flex flex-col gap-4 w-96">
        <p className="text-lg font-medium">{assignment?.description}</p>
        <Divider />
        <div className="flex items-center gap-4">
          <Person fontSize="small" />
          <p>{assignment?.assigned_to.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <CalendarToday fontSize="small" />
          <p>{new Date(assignment?.deadline).toLocaleDateString("pt-Br")}</p>
        </div>
        <Divider />
        <FormControl>
          <InputLabel shrink>Status</InputLabel>
          <Select
            value={selectedStatus || assignment?.status}
            fullWidth
            label="Status"
            onChange={handleStatusChange}
            disabled={isPending}
          >
            {taskStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                <Chip
                  label={statusInfo[status]?.label}
                  color={statusInfo[status]?.severity}
                  size="small"
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleEntity}
          className="flex gap-2 items-center w-fit"
        >
          <OpenInNew fontSize="small" />
          <p className="underline">Ver entidade</p>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTask;
