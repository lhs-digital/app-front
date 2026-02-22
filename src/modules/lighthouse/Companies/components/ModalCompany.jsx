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
import ReactInputMask from "react-input-mask";
import { toast } from "react-toastify";
import FormField from "../../../../components/FormField/index";
import api from "../../../../services/api";
import { validarCNPJ, validarCPF } from "../../../../services/utils";

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

    if (!validarCPF(formData.responsible_cpf)) {
      toast.warning("CPF de Responsável da Empresa inválido!");
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
                <ReactInputMask
                  mask="99.999.999/9999-99"
                  maskChar=" "
                  {...field}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      error={!!errors.cnpj}
                      fullWidth
                      slotProps={{
                        input: {
                          maxLength: 18,
                          readOnly: !dataEdit?.id,
                        },
                      }}
                    />
                  )}
                </ReactInputMask>
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
                <ReactInputMask mask="999.999.999-99" maskChar=" " {...field}>
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      error={!!errors.responsible_cpf}
                      fullWidth
                      slotProps={{
                        input: { readOnly: !dataEdit?.id, maxLength: 14 },
                      }}
                    />
                  )}
                </ReactInputMask>
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
