import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
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
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");

  useEffect(() => {
    if (dataEdit.id) {
      setName(dataEdit.name);
      setCnpj(dataEdit.cnpj);
    }
  }, [dataEdit]);


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

  function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, ""); // Remove caracteres não numéricos

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs inválidos conhecidos (todos os dígitos iguais)
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    // Cálculo dos dígitos verificadores
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros[tamanho - i] * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos[0])) return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros[tamanho - i] * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos[1])) return false;

    return true;
  }

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

    if (!validarCNPJ(cnpj)) {
      toast.warning("CNPJ inválido!");
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

    cleanFields();

    onClose();
  };

  const cleanFields = () => {
    setName("");
    setCnpj("");
  }

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
          inputProps={{
            maxLength: 18,
            minLength: 18,
            number: true
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { onClose(); cleanFields(); }} color="secondary">
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
