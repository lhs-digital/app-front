import { Save } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormField from "../../../../components/FormField/index";
import api from "../../../../services/api";

const defaultValues = {
  name: "",
  cnpj: "",
  dba: "",
  responsible_cpf: "",
  postalCode: "",
  street: "",
  neighborhood: "",
  city: "",
  state: "",
  country: "",
  complement: "",
  number: "",
};

const ModalCompany = ({
  data,
  dataEdit,
  isOpen,
  onClose,
  setRefresh,
  refresh,
}) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues });

  const watchedPostalCode = watch("postalCode");

  useEffect(() => {
    if (dataEdit?.id) {
      reset({
        name: dataEdit?.name || "",
        cnpj: dataEdit?.cnpj || "",
        dba: dataEdit?.dba || "",
        responsible_cpf: dataEdit?.responsible_cpf || "",
        postalCode: dataEdit?.address?.postal_code || "",
        street: dataEdit?.address?.street || "",
        neighborhood: dataEdit?.address?.neighborhood || "",
        city: dataEdit?.address?.city || "",
        state: dataEdit?.address?.state || "",
        country: dataEdit?.address?.country || "",
        complement: dataEdit?.address?.complement || "",
        number: dataEdit?.address?.number || "",
      });
    }
  }, [dataEdit, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (watchedPostalCode?.length === 8) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${watchedPostalCode}/json/`,
          );
          const data = await response.json();

          if (data.erro) {
            toast.warning("CEP inválido!");
          } else {
            setValue("street", data.logradouro || "");
            setValue("neighborhood", data.bairro || "");
            setValue("city", data.localidade || "");
            setValue("state", data.uf || "");
            setValue("country", "Brasil");
          }
        } catch (error) {
          console.error("Erro ao buscar CEP", error);
        }
      };

      fetchAddress();
    }
  }, [watchedPostalCode, setValue]);

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
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

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
  };

  const cnpjAlreadyExists = (cnpjValue) => {
    const cleanCnpj = (v) => (v ? v.replace(/\D/g, "") : "");
    if (cleanCnpj(dataEdit?.cnpj) !== cleanCnpj(cnpjValue) && data?.length) {
      return data.find((item) => cleanCnpj(item.cnpj) === cleanCnpj(cnpjValue));
    }
    return false;
  };

  const formatCNPJ = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 14) {
      return digits.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5",
      );
    }
    return value;
  };

  const formatCPF = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return value;
  };

  const buildPayload = (formData) => ({
    name: formData.name,
    cnpj: formData.cnpj,
    dba: formData.dba,
    responsible_cpf: formData.responsible_cpf,
    address: {
      postal_code: formData.postalCode,
      street: formData.street,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      complement: formData.complement,
      number: formData.number,
    },
  });

  const onSubmit = async (formData) => {
    if (!validarCNPJ(formData.cnpj)) {
      toast.warning("CNPJ inválido!");
      return;
    }

    if (!validarCpf(formData.responsible_cpf)) {
      toast.warning("CPF de Responsável da Empresa inválido!");
      return;
    }

    if (cnpjAlreadyExists(formData.cnpj)) {
      toast.warning("CNPJ já cadastrado!");
      return;
    }

    try {
      if (dataEdit?.id) {
        await api.put(`/companies/${dataEdit.id}`, buildPayload(formData));
        toast.success("Empresa alterada com sucesso!");
      } else {
        await api.post("/companies", buildPayload(formData));
        toast.success("Empresa cadastrada com sucesso!");
      }
      setRefresh(!refresh);
      reset(defaultValues);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar empresa", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {dataEdit?.id ? "Editar Empresa" : "Cadastrar Empresa"}
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-6 gap-4"
        >
          <FormField
            label="Razão Social"
            error={!!errors.name}
            containerClass="col-span-full md:col-span-3"
            required
          >
            <TextField
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name", { required: "Razão Social é obrigatória" })}
            />
          </FormField>

          <FormField
            label="Nome Fantasia"
            error={!!errors.dba}
            containerClass="col-span-full md:col-span-3"
            required
          >
            <TextField
              fullWidth
              error={!!errors.dba}
              helperText={errors.dba?.message}
              {...register("dba", { required: "Nome Fantasia é obrigatório" })}
            />
          </FormField>

          <Controller
            name="cnpj"
            control={control}
            rules={{ required: "CNPJ é obrigatório" }}
            render={({ field }) => (
              <FormField
                label="CNPJ"
                error={!!errors.cnpj}
                containerClass="col-span-full md:col-span-3"
                required
              >
                <TextField
                  {...field}
                  fullWidth
                  error={!!errors.cnpj}
                  helperText={errors.cnpj?.message}
                  slotProps={{ input: { maxLength: 18 } }}
                  onChange={(e) => field.onChange(formatCNPJ(e.target.value))}
                />
              </FormField>
            )}
          />

          <Controller
            name="responsible_cpf"
            control={control}
            rules={{ required: "CPF do Responsável é obrigatório" }}
            render={({ field }) => (
              <FormField
                label="CPF do Responsável"
                error={!!errors.responsible_cpf}
                containerClass="col-span-full md:col-span-3"
                required
              >
                <TextField
                  {...field}
                  fullWidth
                  error={!!errors.responsible_cpf}
                  helperText={errors.responsible_cpf?.message}
                  slotProps={{ input: { maxLength: 14 } }}
                  onChange={(e) => field.onChange(formatCPF(e.target.value))}
                />
              </FormField>
            )}
          />

          <Typography className="col-span-full" sx={{ mt: 1 }}>
            <b>Endereço</b>
          </Typography>

          <FormField
            label="CEP"
            error={!!errors.postalCode}
            containerClass="col-span-full md:col-span-2"
            required
          >
            <TextField
              fullWidth
              error={!!errors.postalCode}
              helperText={errors.postalCode?.message}
              slotProps={{ input: { maxLength: 8 } }}
              {...register("postalCode", { required: "CEP é obrigatório" })}
            />
          </FormField>

          <FormField label="País" containerClass="col-span-full md:col-span-2">
            <TextField fullWidth disabled {...register("country")} />
          </FormField>

          <FormField
            label="Número"
            error={!!errors.number}
            containerClass="col-span-full md:col-span-2"
            required
          >
            <TextField
              fullWidth
              error={!!errors.number}
              helperText={errors.number?.message}
              {...register("number", { required: "Número é obrigatório" })}
            />
          </FormField>

          <FormField
            label="Logradouro"
            containerClass="col-span-full md:col-span-3"
          >
            <TextField fullWidth disabled {...register("street")} />
          </FormField>

          <FormField
            label="Bairro"
            containerClass="col-span-full md:col-span-3"
          >
            <TextField fullWidth disabled {...register("neighborhood")} />
          </FormField>

          <FormField
            label="Cidade"
            containerClass="col-span-full md:col-span-2"
          >
            <TextField fullWidth disabled {...register("city")} />
          </FormField>

          <FormField
            label="Estado"
            containerClass="col-span-full md:col-span-2"
          >
            <TextField fullWidth disabled {...register("state")} />
          </FormField>

          <FormField
            label="Complemento"
            error={!!errors.complement}
            containerClass="col-span-full md:col-span-2"
            required
          >
            <TextField
              fullWidth
              error={!!errors.complement}
              helperText={errors.complement?.message}
              {...register("complement")}
            />
          </FormField>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            reset(defaultValues);
            onClose();
          }}
          color="error"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          color="primary"
          variant="contained"
          startIcon={<Save fontSize="small" />}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalCompany;
