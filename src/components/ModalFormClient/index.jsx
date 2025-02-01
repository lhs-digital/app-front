import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Input,
  MenuItem,
  Select,
  Typography,
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

const ModalFormClient = ({ isOpen, onClose, selectedActivitie }) => {
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
            ) !== -1
              ? ""
              : responseClient?.data.tipo_pessoa,
          whatsapp: responseClient?.data.whatsapp || "",
          data_nascimento: responseClient?.data.data_nascimento || "",
          cnpj_cpf: responseClient?.data.cnpj_cpf || "",
          referencia: responseClient?.data.referencia || "",
          contribuinte_icms:
            fieldsWithErrors?.findIndex(
              (field) => field.label === "Contribuinte de ICMS",
            ) !== -1
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
    try {
      await api.put(`/clients/${selectedActivitie?.record_id}`, {
        numero: form.numero,
        email: form.email,
        tipo_pessoa: form.tipo_pessoa,
        whatsapp: form.whatsapp,
        data_nascimento: form.data_nascimento,
        cnpj_cpf: form.cnpj_cpf,
        referencia: form.referencia,
        contribuinte_icms: form.contribuinte_icms,
      });

      toast.success("Cliente editado com sucesso!");
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
      !form.contribuinte_icms
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
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Formulário para correção de dados inválidos
        <Typography>ID do Cliente: #{selectedActivitie?.record_id}</Typography>
        <Typography color="textSecondary" fontWeight="normal" fontSize="small">
          Os campos com borda vermelha representam os campos inválidos do
          Cliente
        </Typography>
        <Divider sx={{ borderColor: "gray.300", width: "100%", my: 2 }} />
      </DialogTitle>
      <DialogContent>
        <Box>
          <FormControl fullWidth margin="normal">
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <FormLabel htmlFor="numero">Número da residência *</FormLabel>
                <Input
                  id="numero"
                  type="number"
                  value={form?.numero}
                  placeholder="Digite o Número da residência"
                  disabled={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Numero da residência",
                    ) === -1
                  }
                  error={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Numero da residência",
                    ) !== -1
                  }
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E") {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => setForm({ ...form, numero: e.target.value })}
                />
                <Typography fontSize="small" color="textSecondary" mt={1}>
                  Exemplo: 123
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormLabel htmlFor="email">Email *</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  placeholder="Digite o Email"
                  disabled={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Email",
                    ) === -1
                  }
                  error={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Email",
                    ) !== -1
                  }
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Typography fontSize="small" color="textSecondary" mt={1}>
                  Exemplo: usuario@dominio.com
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <FormLabel htmlFor="tipo_pessoa">Tipo de Pessoa *</FormLabel>
                <Select
                  id="tipo_pessoa"
                  value={form.tipo_pessoa}
                  disabled={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Tipo de Pessoa",
                    ) === -1
                  }
                  error={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Tipo de Pessoa",
                    ) !== -1
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tipo_pessoa: e.target.value,
                      cnpj_cpf: "",
                    })
                  }
                >
                  <MenuItem value="">Selecione uma opção</MenuItem>
                  <MenuItem value="F">Pessoa Física</MenuItem>
                  <MenuItem value="J">Pessoa Jurídica</MenuItem>
                </Select>
                <Typography fontSize="small" color="textSecondary" mt={1}>
                  Escolha entre Pessoa Física ou Jurídica
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormLabel htmlFor="whatsapp">WhatsApp *</FormLabel>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  placeholder="Digite o WhatsApp"
                  disabled={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Whatsapp",
                    ) === -1
                  }
                  error={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Whatsapp",
                    ) !== -1
                  }
                  maxLength={15}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    const formatted = value
                      .replace(/^(\d{2})(\d)/, "($1) $2")
                      .replace(/(\d{5})(\d)/, "$1-$2")
                      .slice(0, 15);
                    setForm({ ...form, whatsapp: formatted });
                  }}
                />
                <Typography fontSize="small" color="textSecondary" mt={1}>
                  Exemplo: (99) 99999-9999
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <FormLabel htmlFor="data_nascimento">
                  Data de Nascimento *
                </FormLabel>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={form.data_nascimento}
                  placeholder="Digite a Data de Nascimento"
                  disabled={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Data de Nascimento",
                    ) === -1
                  }
                  error={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Data de Nascimento",
                    ) !== -1
                  }
                  onChange={(e) =>
                    setForm({ ...form, data_nascimento: e.target.value })
                  }
                />
                <Typography fontSize="small" color="textSecondary" mt={1}>
                  Exemplo: 01/01/2000
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormLabel htmlFor="cnpj_cpf">
                  {form.tipo_pessoa === "F" ? "CPF" : "CNPJ"} *
                </FormLabel>
                <Input
                  id="cnpj_cpf"
                  type="text"
                  value={form.cnpj_cpf}
                  placeholder={
                    form.tipo_pessoa === "F" ? "Digite o CPF" : "Digite o CNPJ"
                  }
                  disabled={
                    fieldsWithErrors?.findIndex(
                      (field) =>
                        field.label === "CPF" || field.column === "CNPJ",
                    ) === -1
                  }
                  error={
                    fieldsWithErrors?.findIndex(
                      (field) =>
                        field.label === "CPF" || field.column === "CNPJ",
                    ) !== -1
                  }
                  maxLength={form.tipo_pessoa === "F" ? 14 : 18}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    let formatted = value;

                    if (form.tipo_pessoa === "F") {
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

                    setForm({
                      ...form,
                      cnpj_cpf: formatted.slice(
                        0,
                        form.tipo_pessoa === "F" ? 14 : 18,
                      ),
                    });
                  }}
                />
                <Typography fontSize="small" color="textSecondary" mt={1}>
                  {form.tipo_pessoa === "F"
                    ? "Exemplo: 000.000.000-00"
                    : "Exemplo: 00.000.000/0000-00"}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <FormLabel htmlFor="referencia">
                  Referência do Endereço *
                </FormLabel>
                <Input
                  id="referencia"
                  type="text"
                  value={form.referencia || client?.referencia}
                  placeholder="Digite a Referência do Endereço"
                  disabled={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Referência do Endereço",
                    ) === -1
                  }
                  error={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Referência do Endereço",
                    ) !== -1
                  }
                  onChange={(e) =>
                    setForm({ ...form, referencia: e.target.value })
                  }
                />
                <Typography fontSize="small" color="textSecondary" mt={1}>
                  Exemplo: Próximo ao mercado
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormLabel htmlFor="contribuinte_icms">
                  Contribuinte de ICMS *
                </FormLabel>
                <Select
                  id="contribuinte_icms"
                  value={form.contribuinte_icms}
                  disabled={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Contribuinte de ICMS",
                    ) === -1
                  }
                  error={
                    fieldsWithErrors?.findIndex(
                      (field) => field.label === "Contribuinte de ICMS",
                    ) !== -1
                  }
                  onChange={(e) =>
                    setForm({ ...form, contribuinte_icms: e.target.value })
                  }
                >
                  <MenuItem value="">Selecione uma opção</MenuItem>
                  <MenuItem value={0}>Não</MenuItem>
                  <MenuItem value={1}>Sim</MenuItem>
                </Select>
                <Typography fontSize="small" color="textSecondary" mt={1}>
                  Exemplo: Sim ou Não
                </Typography>
              </Grid>
            </Grid>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Voltar</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Atualizar Dados
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFormClient;
