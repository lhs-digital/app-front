import { Close } from "@mui/icons-material";
import {
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useThemeMode } from "../../../../contexts/themeModeContext";
import {
  dateFormatted,
  formatInterval,
  formattedPriority,
  getPriorityColor,
} from "../../../../services/utils";
import { handleMode } from "../../../../theme";
import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { toast } from "react-toastify";
import { useCompany } from "../../../../hooks/useCompany";

const AuditIntervalModal = ({ item, isOpen, onClose }) => {
  const [updateInterval, setUpdateInterval] = useState("");
  const { company } = useCompany();

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/companies/${company?.id}/audit/summary`);
      setUpdateInterval(response.data.audit_interval);
    };
    fetchData();
  }, []);

  const handleIntervalChange = (event) => {
    setUpdateInterval(event.target.value);
  };

  const handleClearIntervalChange = () => {
    setUpdateInterval("");
  };

  const confirmIntervalChange = async () => {
    try {
      await api.put(`/companies/${company?.id}/audit_interval`, {
        audit_interval: updateInterval,
      });
      toast.success(
        `Intervalo de auditoria atualizado para ${formatInterval(updateInterval)} com sucesso!`,
      );
    } catch (error) {
      console.error("Erro ao atualizar o uditoria", error);
      toast.error("Erro ao atualizar o intervalo de auditoria");
    }
  };

  const cleanFields = () => {
    setUpdateInterval("");
  };

  const handleSave = () => {
    confirmIntervalChange();
    onClose();
    cleanFields();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <h2>Definir Intervalo de Auditoria</h2>
        <IconButton onClick={onClose} size="small">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <FormControl fullWidth>
          <Select
            value={updateInterval || ""}
            onChange={handleIntervalChange}
          >
            <MenuItem value={600}>10 minutos</MenuItem>
            <MenuItem value={1800}>30 minutos</MenuItem>
            <MenuItem value={3600}>1 hora</MenuItem>
            <MenuItem value={21600}>6 horas</MenuItem>
            <MenuItem value={43200}>12 horas</MenuItem>
            <MenuItem value={86400}>1 dia</MenuItem>
            <MenuItem value={604800}>1 semana</MenuItem>
            <MenuItem value={2592000}>1 mês</MenuItem>
            <MenuItem value={31536000}>1 ano</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          color="info"
          mr={3}
          onClick={() => {
            onClose(), cleanFields();
          }}
        >
          CANCELAR
        </Button>
        <Button color="primary" onClick={handleSave}>
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuditIntervalModal;
