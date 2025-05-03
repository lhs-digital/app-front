import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
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
  const [dba, setDba] = useState("");
  const [responsible_cpf, setResponsible_cpf] = useState("");
  const [address, setAddress] = useState({
    postalCode: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    complement: "",
    number: ""
  });

  useEffect(() => {
    if (dataEdit?.id) {
      setName(dataEdit?.name);
      setCnpj(dataEdit?.cnpj);
      setDba(dataEdit?.dba);
      setResponsible_cpf(dataEdit?.responsible_cpf);
      setAddress({
        postalCode: dataEdit?.address?.postal_code,
        street: dataEdit?.address?.street,
        neighborhood: dataEdit?.address?.neighborhood,
        city: dataEdit?.address?.city,
        state: dataEdit?.address?.state,
        country: dataEdit?.address?.country,
        complement: dataEdit?.address?.complement,
        number: dataEdit?.address?.number
      });
    }
  }, [dataEdit]);

  useEffect(() => {
    if (!isOpen) {
      cleanFields();
    }
  }, [isOpen]);

  useEffect(() => {
    if (address.postalCode.length === 8 || dataEdit?.address?.postal_code) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${address.postalCode}/json/`);
          const data = await response.json();

          if (data.erro) {
            toast.warning("CEP inválido!");
          } else {
            setAddress((prev) => ({
              ...prev,
              street: data.logradouro || "",
              neighborhood: data.bairro || "",
              city: data.localidade || "",
              state: data.uf || "",
              country: "Brasil",
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar CEP", error);
        }
      };

      fetchAddress();
    }
  }, [address.postalCode || dataEdit?.address?.postal_code]);

  const saveData = async () => {
    try {
      await api.post("/companies", {
        name,
        cnpj,
        dba,
        responsible_cpf,
        address: {
          postal_code: address.postalCode,
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          country: address.country,
          complement: address.complement,
          number: address.number
        }
      });

      setRefresh(!refresh);
      toast.success("Empresa cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar empresa", error);
    }
  };

  const validarCpf = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, "");

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1{13}$/.test(cnpj)) return false;

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
      await api.put(`/companies/${dataEdit?.id}`, {
        name,
        cnpj,
        dba,
        responsible_cpf,
        address: {
          postal_code: address.postalCode,
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          country: address.country,
          complement: address.complement,
          number: address.number
        }
      });

      setRefresh(!refresh);
      toast.success("Empresa alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar empresa", error);
    }
  };

  const handleSave = () => {
    console.log("name", name);
    console.log("cnpj", cnpj);
    console.log("dba", dba);
    console.log("responsible_cpf", responsible_cpf);
    console.log("address", address);

    if (!name || !cnpj || !responsible_cpf || !dba || !address.postalCode || !address.street || !address.neighborhood || !address.city || !address.state || !address.country || !address.number || !address.complement) {
      toast.warning("Preencha os campos obrigatórios: Nome, CNPJ, Nome Fantasia, CPF do Responsável e Endereço!");
      return;
    }

    if (!validarCNPJ(cnpj)) {
      toast.warning("CNPJ inválido!");
      return;
    }

    if (!validarCpf(responsible_cpf)) {
      toast.warning("CPF de Responsável da Empresa inválido!");
      return;
    }

    if (cnpjAlreadyExists()) {
      toast.warning("CNPJ já cadastrado!");
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

  const cleanFields = () => {
    setName("");
    setCnpj("");
    setDba("");
    setResponsible_cpf("");
    setAddress({
      postalCode: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "",
      complement: "",
      number: ""
    });
  }

  const cnpjAlreadyExists = () => {
    const cleanCnpj = (cnpj) => (cnpj ? cnpj.replace(/\D/g, "") : "");

    if (cleanCnpj(dataEdit.cnpj) !== cleanCnpj(cnpj) && data?.length) {
      return data.find((item) => cleanCnpj(item.cnpj) === cleanCnpj(cnpj));
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

  const mascaraValidacaoCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length === 11) {
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
          label="Razão Social *"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Nome Fantasia *"
          type="text"
          value={dba}
          onChange={(e) => setDba(e.target.value)}
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
        <TextField
          label="CPF do Responsável da Empresa *"
          type="text"
          value={responsible_cpf}
          onChange={(e) => {
            if (mascaraValidacaoCPF(e.target.value)) {
              setResponsible_cpf(
                e.target.value.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{2})/,
                  "$1.$2.$3-$4",
                ),
              );
            } else {
              setResponsible_cpf(e.target.value);
            }
          }}
          fullWidth
          margin="dense"
          inputProps={{
            maxLength: 14,
            minLength: 14,
            number: true
          }}
        />
        <Typography sx={{ mt: 2 }}>
          <b>Endereço</b>
        </Typography>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6} sx={{ pr: 1 }}>
            <TextField
              label="CEP *"
              type="text"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              fullWidth
              inputProps={{
                maxLength: 8,
                minLength: 8,
                number: true
              }}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="País"
              type="text"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              fullWidth
              disabled
              margin="dense"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Logradouro"
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              fullWidth
              disabled
              margin="dense"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Bairro"
              type="text"
              value={address.neighborhood}
              onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
              fullWidth
              disabled
              margin="dense"
            />
          </Grid>

          <Grid item xs={12} sm={5} sx={{ pr: 1 }}>
            <TextField
              label="Cidade"
              type="text"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              fullWidth
              disabled
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={3} sx={{ pr: 1 }}>
            <TextField
              label="Estado"
              type="text"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              fullWidth
              disabled
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Número"
              type="text"
              value={address.number}
              onChange={(e) => setAddress({ ...address, number: e.target.value })}
              fullWidth
              margin="dense"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Complemento"
              type="text"
              value={address.complement}
              onChange={(e) => setAddress({ ...address, complement: e.target.value })}
              fullWidth
              margin="dense"
            />
          </Grid>
        </Grid>
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

export default ModalCompany;
