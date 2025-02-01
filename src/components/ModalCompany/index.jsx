import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const ModalCompany = ({
  data,
  dataEdit,
  isOpen,
  onClose,
  setRefresh,
  refresh,
}) => {
  const [name, setName] = useState(dataEdit.name || "");
  const [cnpj, setCnpj] = useState(dataEdit.cnpj || "");

  const saveData = async () => {
    try {
      await api.post("/companies", {
        name,
        cnpj,
      });

      setRefresh(!refresh);
      toast.success("Empresa cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar empresa", error);
    }
  };

  const updateUser = async () => {
    try {
      await api.put(`/companies/${dataEdit.id}`, {
        name,
        cnpj,
      });

      setRefresh(!refresh);
      toast.success("Empresa alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar empresa", error);
    }
  };

  const handleSave = () => {
    if (!name || !cnpj) {
      toast.warning("Preencha os campos obrigatórios: Nome e CNPJ");
      return;
    }

    if (cnpjAlreadyExists()) {
      toast.warning("CNPJ já cadastrado!");
      return;
    }

    if (dataEdit.id) {
      updateUser();
    } else {
      saveData();
    }

    onClose();
  };

  const cnpjAlreadyExists = () => {
    if (dataEdit.cnpj !== cnpj && data?.length) {
      return data.find((item) => item.cnpj === cnpj);
    }

    return false;
  };

  const mascaraValidacaoCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/\D/g, "");
    if (cnpj.length === 14) {
      return true;
    }
    return false;
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {dataEdit.id ? "Editar Empresa" : "Cadastrar Empresa"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Nome *"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="CNPJ *"
          type="text"
          value={cnpj}
          onChange={(e) => {
            if (mascaraValidacaoCNPJ(e.target.value)) {
              setCnpj(
                e.target.value.replace(
                  /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                  "$1.$2.$3/$4-$5",
                ),
              );
            } else {
              setCnpj(e.target.value);
            }
          }}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          CANCELAR
        </Button>
        <Button onClick={handleSave} color="primary">
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCompany;
