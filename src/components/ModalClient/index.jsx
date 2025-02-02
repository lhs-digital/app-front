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
import api from "../../services/api";
import {
  validarCNPJ,
  validarCPF,
  validarDataNascimento,
  validarEmail,
} from "../../services/utils";
import InputMask from "react-input-mask";

const ModalClient = ({
  data,
  dataEdit,
  isOpen,
  onClose,
  setRefresh,
}) => {
  const [email, setEmail] = useState("");
  const [numero, setNumero] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState(-1);
  const [whatsapp, setWhatsapp] = useState("");
  const [dataNascimento, setDataNascimento] = useState(
    "",
  );
  const [cnpjCpf, setCnpjCpf] = useState("");
  const [referencia, setReferencia] = useState("");
  const [contribuenteIcms, setContribuenteIcms] = useState(
    -1,
  );

  useEffect(() => {
    setEmail(dataEdit?.email || "");
    setNumero(dataEdit?.numero || "");
    setTipoPessoa(dataEdit?.tipo_pessoa || -1);
    setWhatsapp(dataEdit?.whatsapp || "");
    setDataNascimento(dataEdit?.data_nascimento || "");
    setCnpjCpf(dataEdit?.cnpj_cpf || "");
    setReferencia(dataEdit?.referencia || "");
    setContribuenteIcms(dataEdit?.contribuinte_icms || -1);
  }, [dataEdit]);


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

      setRefresh((prev) => !prev);

      toast.success("Cliente cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar cliente", error);
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

      setRefresh((prev) => !prev);

      toast.success("Cliente editado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar Cliente", error);
    }
  };

  const handleSave = () => {
     if (
      !email ||
      !numero ||
      tipoPessoa === -1 ||
      !whatsapp ||
      !dataNascimento ||
      !cnpjCpf ||
      !referencia ||
      contribuenteIcms === -1
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

    cleanFields();

    onClose();
  };

  const cleanFields = () => {
    setEmail("");
    setNumero("");
    setTipoPessoa("");
    setWhatsapp("");
    setDataNascimento("");
    setCnpjCpf("");
    setReferencia("");
    setContribuenteIcms("");
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
              placeholder="Digite o E-mail"
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Box>
          <Box display={{ xs: "block", md: "flex" }} gap={2}>
            <Box flexBasis={{ xs: "100%", md: "50%" }}>
              <InputLabel>Número da Residência*</InputLabel>
              <TextField
                type="number"
                value={numero}
                placeholder="Digite o Número da residência"
                onChange={(e) => setNumero(e.target.value)}
                fullWidth
              />
            </Box>
            <Box flexBasis={{ xs: "100%", md: "50%" }}>
              <InputLabel>Whatsapp *</InputLabel>
              <InputMask
                mask="(99) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    id="whatsapp"
                    fullWidth
                    type="tel"
                    placeholder="Digite o WhatsApp"
                  />
                )}
              </InputMask>
            </Box>
          </Box>
          <Box display={{ xs: "block", md: "flex" }} gap={2}>
            <Box flexBasis={{ xs: "100%", md: "50%" }}>
              <InputLabel>Tipo de Pessoa *</InputLabel>
              <Select
                value={tipoPessoa}
                onChange={(e) => (setTipoPessoa(e.target.value), setCnpjCpf(""))}
                fullWidth
              >
                <MenuItem value={-1} disabled>Selecione</MenuItem>
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
                <MenuItem value={-1} disabled>Selecione</MenuItem>
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
                inputProps={{ max: new Date().toISOString().split("T")[0] }}
              />
            </Box>
            <Box flexGrow={1}>
              <InputLabel>{tipoPessoa === "F" ? "CPF" : tipoPessoa === "J" ? "CNPJ" : "CPF/CNPJ"} *</InputLabel>
              <TextField
                 id="cnpj_cpf"
                 type="text"
                 value={cnpjCpf}
                 fullWidth
                 inputProps={tipoPessoa === "F" ? { maxLength: 14 } : { maxLength: 18 }}
                 placeholder={
                  tipoPessoa === "F" ? "Digite o CPF" : "Digite o CNPJ"
                 }
                 onChange={(e) => {
                   const value = e.target.value.replace(/\D/g, "");
                   let formatted = value;

                   if (tipoPessoa === "F") {
                     formatted = value
                       .replace(/(\d{3})(\d)/, "$1.$2")
                       .replace(/(\d{3})(\d)/, "$1.$2")
                       .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
                   } else {
                     formatted = value
                       .replace(/(\d{2})(\d)/, "$1.$2")
                       .replace(/(\d{3})(\d)/, "$1.$2")
                       .replace(/(\d{3})(\d)/, "$1/$2")
                       .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
                   }

                   setCnpjCpf(
                     formatted.slice(
                       0,
                       tipoPessoa === "F" ? 14 : 18,
                     ),
                   );
                 }}
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
