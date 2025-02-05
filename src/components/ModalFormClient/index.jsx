import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import api from "../../services/api";
import {
  validarCNPJ,
  validarCPF,
  validarDataNascimento,
  validarEmail,
} from "../../services/utils";

const ModalFormClient = ({
  isOpen,
  onClose,
  selectedActivitie,
  setRefresh,
}) => {
  //eslint-disable-next-line
  const [fields, setFields] = useState([]);
  const fieldsWithErrors = selectedActivitie?.columns;
  const [client, setClient] = useState({});

  const [form, setForm] = useState({
    numero: "",
    email: "",
    tipo_pessoa: "",
    whatsapp: "",
    data_nascimento: "",
    cnpj_cpf: "",
    referencia: "",
    contribuinte_icms: "",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/company_tables/all_tables`);
        setFields(response.data.data[0].columns);
        const responseClient = await api.get(
          `/clients/${selectedActivitie?.record_id}`,
        );
        setClient(responseClient?.data);
        setForm({
          numero: responseClient?.data.numero || "",
          email: responseClient?.data.email || "",
          tipo_pessoa:
            fieldsWithErrors?.findIndex(
              (field) => field.label === "Tipo de Pessoa",
            ) !== -1 && selectedActivitie?.status === 0
              ? ""
              : responseClient?.data.tipo_pessoa,
          whatsapp: responseClient?.data.whatsapp || "",
          data_nascimento: responseClient?.data.data_nascimento || "",
          cnpj_cpf: responseClient?.data.cnpj_cpf || "",
          referencia: responseClient?.data.referencia || "",
          contribuinte_icms:
            fieldsWithErrors?.findIndex(
              (field) => field.label === "Contribuinte de ICMS",
            ) !== -1 && selectedActivitie?.status === 0
              ? ""
              : responseClient?.data.contribuinte_icms,
        });
      } catch (error) {
        console.error("Erro ao carregar os dados dos clientes", error);
      }
    };
    getData();
  }, []);

  const updateUser = async () => {
    const data = {
      numero: form.numero.replace(/\D/g, ""),
      email: form.email,
      tipo_pessoa: form.tipo_pessoa,
      whatsapp: form.whatsapp.replace(/\D/g, ""),
      data_nascimento: form.data_nascimento,
      cnpj_cpf: form.cnpj_cpf.replace(/\D/g, ""),
      referencia: form.referencia,
      contribuinte_icms: form.contribuinte_icms,
    };
    try {
      await api.put(`/clients/${selectedActivitie?.record_id}`, data);

      toast.success("Correção de dados do cliente concluída com sucesso!");

      await api.put(`auditing/${selectedActivitie?.id}/toggle_status`);

      setRefresh((prev) => !prev);
      onClose();
    } catch (error) {
      console.error("Erro ao editar usuário", error);
    }
  };

  const handleSave = () => {
    if (
      !form.numero ||
      !form.email ||
      !form.tipo_pessoa ||
      !form.whatsapp ||
      !form.data_nascimento ||
      !form.cnpj_cpf ||
      !form.referencia ||
      form.contribuinte_icms === ""
    ) {
      toast.warning("Preencha todos os campos obrigatórios");
      return;
    }

    if (!validarEmail(form.email)) {
      toast.warning("E-mail inválido");
      return;
    }

    if (!validarDataNascimento(form.data_nascimento)) {
      toast.warning(
        "Data de nascimento inválida. O cliente deve ser maior de 18 anos.",
      );
      return;
    }

    if (form.tipo_pessoa === "F" && !validarCPF(form?.cnpj_cpf)) {
      toast.warning("CPF inválido");
      return;
    }

    if (form.tipo_pessoa === "J" && !validarCNPJ(form.cnpj_cpf)) {
      toast.warning("CNPJ inválido");
      return;
    }

    updateUser();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} width="lg" fullWidth>
      <DialogTitle>
        Formulário para correção de dados inválidos
        <Typography>ID do Cliente: #{selectedActivitie?.record_id}</Typography>
        <Typography color="textSecondary" fontWeight="normal" fontSize="small">
          Os campos com borda vermelha representam os campos inválidos do
          Cliente
        </Typography>
        <Divider sx={{ borderColor: "gray.300", width: "100%", my: 2 }} />
      </DialogTitle>
      <DialogContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Box>
          <InputLabel>Número da residência *</InputLabel>
          <TextField
            type="number"
            value={form?.numero}
            placeholder="Digite o Número da residência"
            helperText="Exemplo: 123"
            disabled={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Numero da residência",
              ) === -1 || selectedActivitie?.status
            }
            error={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Numero da residência",
              ) !== -1 || selectedActivitie?.status
            }
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") {
                e.preventDefault();
              }
            }}
            onChange={(e) => setForm({ ...form, numero: e.target.value })}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel>Email *</InputLabel>
          <TextField
            type="email"
            value={form.email}
            placeholder="Digite o Email"
            helperText="Exemplo: usuario@dominio.com"
            disabled={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Email",
              ) === -1 || selectedActivitie?.status
            }
            error={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Email",
              ) !== -1 || selectedActivitie?.status
            }
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel>Tipo de Pessoa *</InputLabel>
          <Select
            value={form.tipo_pessoa}
            disabled={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Tipo de Pessoa",
              ) === -1 || selectedActivitie?.status
            }
            error={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Tipo de Pessoa",
              ) !== -1 || selectedActivitie?.status
            }
            onChange={(e) =>
              setForm({
                ...form,
                tipo_pessoa: e.target.value,
                cnpj_cpf: "",
              })
            }
            fullWidth
          >
            <MenuItem value="F">Pessoa Física</MenuItem>
            <MenuItem value="J">Pessoa Jurídica</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel>WhatsApp *</InputLabel>
          <InputMask
            mask="(99) 99999-9999"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            maskChar=""
            disabled={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Whatsapp",
              ) === -1 || selectedActivitie?.status
            }
            error={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Whatsapp",
              ) !== -1 || selectedActivitie?.status
            }
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                placeholder="Digite o WhatsApp"
                helperText="Exemplo: (99) 99999-9999"
                maxLength={15}
                fullWidth
              />
            )}
          </InputMask>
        </Box>
        <Box>
          <InputLabel>Data de Nascimento *</InputLabel>
          <TextField
            type="date"
            value={form.data_nascimento}
            placeholder="Digite a Data de Nascimento"
            helperText="Exemplo: 01/01/2000"
            disabled={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Data de Nascimento",
              ) === -1 || selectedActivitie?.status
            }
            error={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Data de Nascimento",
              ) !== -1 || selectedActivitie?.status
            }
            onChange={(e) =>
              setForm({ ...form, data_nascimento: e.target.value })
            }
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel>{form.tipo_pessoa === "F" ? "CPF" : "CNPJ"} *</InputLabel>
          <InputMask
            value={form.cnpj_cpf}
            onChange={(e) => setForm({ ...form, cnpj_cpf: e.target.value })}
            mask={
              form.tipo_pessoa === "F" ? "999.999.999-99" : "99.999.999/9999-99"
            }
            maskChar=""
            disabled={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "CPF/CNPJ",
              ) === -1 || selectedActivitie?.status
            }
            error={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "CPF/CNPJ",
              ) !== -1 || selectedActivitie?.status
            }
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                type="text"
                placeholder={
                  form.tipo_pessoa === "F" ? "Digite o CPF" : "Digite o CNPJ"
                }
                maxLength={form.tipo_pessoa === "F" ? 14 : 18}
                fullWidth
              />
            )}
          </InputMask>
        </Box>
        <Box>
          <InputLabel>Referência do Endereço *</InputLabel>
          <TextField
            type="text"
            value={form.referencia || client?.referencia}
            placeholder="Digite a Referência do Endereço"
            helperText="Exemplo: Próximo ao mercado"
            disabled={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Referência do Endereço",
              ) === -1 || selectedActivitie?.status
            }
            error={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Referência do Endereço",
              ) !== -1 || selectedActivitie?.status
            }
            onChange={(e) => setForm({ ...form, referencia: e.target.value })}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel>Contribuinte de ICMS *</InputLabel>
          <Select
            value={form?.contribuinte_icms}
            disabled={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Contribuinte de ICMS",
              ) === -1 || selectedActivitie?.status
            }
            error={
              fieldsWithErrors?.findIndex(
                (field) => field.label === "Contribuinte de ICMS",
              ) !== -1 || selectedActivitie?.status
            }
            onChange={(e) =>
              setForm({ ...form, contribuinte_icms: e.target.value })
            }
            fullWidth
          >
            <MenuItem value={0}>Não</MenuItem>
            <MenuItem value={1}>Sim</MenuItem>
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Voltar</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={selectedActivitie?.status}
        >
          Atualizar Dados
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFormClient;
