import { CalendarToday, OpenInNew, Person } from "@mui/icons-material";
import {
  Chip,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import api from "../../services/api";
import { statusInfo, taskStatuses } from "./utils";

const ViewTask = ({ assignment, open, onClose }) => {
  console.log(assignment);
  const [selectedStatus, setSelectedStatus] = useState(
    assignment?.status || "not_started",
  );
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async (data) => {
      await api.put(`/work_order/${assignment.id}/status`, data);
    },
    onSuccess: (data) => {
      setSelectedStatus(data.status);
    },
  });

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    updateStatus({ status: newStatus });
  };

  const handleEntity = () => {};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Visualizar Tarefa"
      scroll="body"
    >
      <DialogContent className="flex flex-col gap-4 w-96">
        <p className="text-lg font-medium">{assignment?.description}</p>
        <a href="." className="flex gap-2 items-center w-fit">
          <OpenInNew fontSize="small" />
          <p className="underline">Ver entidade</p>
        </a>
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
    </Dialog>
  );
};

export default ViewTask;
