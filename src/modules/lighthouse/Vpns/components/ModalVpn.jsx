import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../services/api";
import { useCompany } from "../../../../hooks/useCompany";

const ModalVpn = ({
  data,
  dataEdit,
  isOpen,
  onClose,
  setRefresh,
  refresh,
}) => {
  const [name, setName] = useState("");
  const { company } = useCompany();
  const [fileVpn, setFileVpn] = useState(null);

  useEffect(() => {
    if (dataEdit?.id) {
      setName(dataEdit?.name);
    }
  }, [dataEdit]);

  useEffect(() => {
    if (!isOpen) {
      cleanFields();
    }
  }, [isOpen]);

  const saveData = async () => {
    try {
      const formData = new FormData();
      formData.append("company_id", company?.id);
      formData.append("name", name);
      formData.append("ovpn_file", fileVpn);

      await api.post("/vpns", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setRefresh(!refresh);
      toast.success("VPN cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar VPN", error);
    }
  };

  const updateUser = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("ovpn_file", fileVpn);
      formData.append("_method", "PUT");

      await api.post(`/vpns/${dataEdit?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setRefresh(!refresh);
      toast.success("VPN alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar VPN", error);
    }
  };

  const handleSave = () => {
    if (!name || !fileVpn) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (dataEdit?.id) {
      updateUser();
    } else {
      saveData();
    }

    cleanFields();

    onClose();
  };

  const handleFileChange = (event) => {
    setFileVpn(event.target.files[0]);
  };

  const cleanFields = () => {
    setName("");
    setFileVpn(null);
  }


  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {dataEdit?.id ? "Editar VPN" : "Cadastrar VPN"}
      </DialogTitle>
      <DialogContent
        className="flex flex-col gap-4"
        style={{ minWidth: 500, minHeight: 200, marginTop: 10 }}>
        <TextField
          label="Nome da VPN *"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="dense"
        />

        <Box>
          <InputLabel>Empresa *</InputLabel>
          <Select value={company.id} disabled fullWidth>
            <MenuItem value={company.id}>{company.name}</MenuItem>
          </Select>
        </Box>

        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { onClose(); cleanFields(); }}>
          VOLTAR
        </Button>
        <Button onClick={handleSave} color="primary">
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalVpn;
