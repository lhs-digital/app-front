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
import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  validarCNPJ,
  validarCPF,
  validarDataNascimento,
  validarEmail,
} from "../../services/utils";

const ModalClient = ({
  data,
  dataEdit,
  isOpen,
  onClose,
  setRefresh,
  refresh,
}) => {
  const [email, setEmail] = useState(dataEdit?.email || "");
  const [numero, setNumero] = useState(dataEdit?.numero || "");
  const [tipoPessoa, setTipoPessoa] = useState(dataEdit?.tipo_pessoa || "");
  const [whatsapp, setWhatsapp] = useState(dataEdit?.whatsapp || "");
  const [dataNascimento, setDataNascimento] = useState(
    dataEdit?.data_nascimento || "",
  );
  const [cnpjCpf, setCnpjCpf] = useState(dataEdit?.cnpj_cpf || "");
  const [referencia, setReferencia] = useState(dataEdit?.referencia || "");
  const [contribuenteIcms, setContribuenteIcms] = useState(
    dataEdit?.contribuinte_icms || "",
  );

  const saveData = async () => {
    try {
      await api.post("/clients", {
        numero: numero,
        email: email,
        tipo_pessoa: tipoPessoa,
        whatsapp: whatsapp,
        data_nascimento: dataNascimento,
        cnpj_cpf: cnpjCpf,
        referencia: referencia,
        contribuinte_icms: contribuenteIcms,
      });

      setRefresh(!refresh);
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
    }
  };

  const updateUser = async () => {
    try {
      await api.put(`/clients/${dataEdit.id}`, {
        numero: numero,
        email: email,
        tipo_pessoa: tipoPessoa,
        whatsapp: whatsapp,
        data_nascimento: dataNascimento,
        cnpj_cpf: cnpjCpf,
        referencia: referencia,
        contribuinte_icms: contribuenteIcms,
      });

      setRefresh(!refresh);
      toast.success("Usuário editado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar usuário", error);
    }
  };

  const handleSave = () => {
    if (
      !email ||
      !numero ||
      !tipoPessoa ||
      !whatsapp ||
      !dataNascimento ||
      !cnpjCpf ||
      !referencia ||
      !contribuenteIcms
    ) {
      toast.warning("Preencha os campos obrigatórios!");
      return;
    }

    if (emailAlreadyExists()) {
      toast.warning("E-mail já cadastrado!");
      return;
    }

    if (!validarEmail(email)) {
      toast.warning("E-mail inválido");
      return;
    }

    if (!validarDataNascimento(dataNascimento)) {
      toast.warning(
        "Data de nascimento inválida. O cliente deve ser maior de 18 anos.",
      );
      return;
    }

    if (tipoPessoa === "F" && !validarCPF(cnpjCpf)) {
      toast.warning("CPF inválido");
      return;
    }

    if (tipoPessoa === "J" && !validarCNPJ(cnpjCpf)) {
      toast.warning("CNPJ inválido");
      return;
    }

    if (dataEdit?.id) {
      updateUser();
    } else {
      saveData();
    }

    onClose();
  };

  const emailAlreadyExists = () => {
    if (dataEdit.email !== email && data?.length) {
      return data.find((item) => item.email === email);
    }

    return false;
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>
        {dataEdit.id
          ? `Editar Cliente com ID: ${dataEdit?.id}`
          : "Cadastrar Cliente"}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <InputLabel>E-mail *</InputLabel>
            <TextField
              type="text"
              value={email}
              disabled={dataEdit?.email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Box>
          <Box display={{ xs: "block", md: "flex" }} gap={2}>
            <Box flexBasis={{ xs: "100%", md: "50%" }}>
              <InputLabel>Número *</InputLabel>
              <TextField
                type="number"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                fullWidth
              />
            </Box>
            <Box flexBasis={{ xs: "100%", md: "50%" }}>
              <InputLabel>Whatsapp *</InputLabel>
              <TextField
                type="text"
                value={whatsapp}
                maxLength={15}
                onChange={(e) => setWhatsapp(e.target.value)}
                fullWidth
              />
            </Box>
          </Box>
          <Box display={{ xs: "block", md: "flex" }} gap={2}>
            <Box flexBasis={{ xs: "100%", md: "50%" }}>
              <InputLabel>Tipo de Pessoa *</InputLabel>
              <Select
                value={tipoPessoa}
                onChange={(e) => setTipoPessoa(e.target.value)}
                fullWidth
              >
                <MenuItem value="F">Física</MenuItem>
                <MenuItem value="J">Jurídica</MenuItem>
              </Select>
            </Box>
            <Box flexBasis={{ xs: "100%", md: "50%" }}>
              <InputLabel>Contribuinte ICMS *</InputLabel>
              <Select
                value={contribuenteIcms}
                onChange={(e) => setContribuenteIcms(e.target.value)}
                fullWidth
              >
                <MenuItem value={1}>Sim</MenuItem>
                <MenuItem value={0}>Não</MenuItem>
              </Select>
            </Box>
          </Box>
          <Box display={{ xs: "block", md: "flex" }} gap={2}>
            <Box flexBasis={{ xs: "100%", md: "35%" }}>
              <InputLabel>Data de Nascimento *</InputLabel>
              <TextField
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                fullWidth
              />
            </Box>
            <Box flexGrow={1}>
              <InputLabel>CNPJ/CPF *</InputLabel>
              <TextField
                type="text"
                value={cnpjCpf}
                maxLength={tipoPessoa === "F" ? 14 : 18}
                onChange={(e) => setCnpjCpf(e.target.value)}
                fullWidth
              />
            </Box>
          </Box>
          <Box>
            <InputLabel>Referência *</InputLabel>
            <TextField
              type="text"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              fullWidth
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          CANCELAR
        </Button>
        <Button onClick={handleSave} color="primary">
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalClient;
