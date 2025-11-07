import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCompany } from "../../../../hooks/useCompany";
import api from "../../../../services/api";
import { formatInterval } from "../../../../services/utils";
import AuditIntervalForm from "./AuditIntervalForm";

const AuditIntervalModal = ({ isOpen, onClose }) => {
  const [updateInterval, setUpdateInterval] = useState("");
  const { company } = useCompany();

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/companies/${company?.id}/audit/summary`);
      setUpdateInterval(response.data.audit_interval);
    };
    fetchData();
  }, []);

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
        <AuditIntervalForm
          interval={updateInterval}
          onChange={setUpdateInterval}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="info"
          mr={3}
          onClick={() => {
            (onClose(), cleanFields());
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
