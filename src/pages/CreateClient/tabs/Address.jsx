import { Box, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { useClientForm } from "..";

const Address = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const zipCode = watch("zip_code");
  const { isEditing, isCreating } = useClientForm();

  useEffect(() => {
    const fetchAddress = async (cep) => {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`,
        );
        const data = response.data;
        if (!data.erro) {
          setValue("street", data.logradouro);
          setValue("neighborhood", data.bairro);
          setValue("city", data.localidade);
          setValue("complement", data.complemento);
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar o endereço pelo CEP", error);
        toast.error("Erro ao buscar o endereço pelo CEP");
      }
    };

    if (zipCode && zipCode.length === 8 && !watch("street")) {
      fetchAddress(zipCode);
    }
  }, [zipCode, setValue]);

  const handleZipCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("zip_code", value);

    if (value.length === 0) {
      setValue("street", "");
      setValue("neighborhood", "");
      setValue("city", "");
      setValue("complement", "");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box className="lg:col-span-1">
        <InputLabel required>CEP</InputLabel>
        <InputMask
          mask="99999-999"
          maskChar=" "
          {...register("zip_code", { required: "CEP é obrigatório" })}
          onChange={handleZipCodeChange}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              fullWidth
              error={!!errors.zip_code}
              InputProps={{
                readOnly: !isEditing && !isCreating,
              }}
              helperText={errors.zip_code?.message}
              type="text"
            />
          )}
        </InputMask>
      </Box>
      <Box className="lg:col-span-3">
        <InputLabel required>Endereço</InputLabel>
        <TextField
          type="text"
          disabled
          {...register("street", { required: "Endereço é obrigatório" })}
          fullWidth
          error={!!errors.street}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.street?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Bairro</InputLabel>
        <TextField
          type="text"
          disabled
          {...register("neighborhood", { required: "Bairro é obrigatório" })}
          fullWidth
          error={!!errors.neighborhood}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.neighborhood?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Cidade</InputLabel>
        <TextField
          type="text"
          disabled
          {...register("city", { required: "Cidade é obrigatória" })}
          fullWidth
          error={!!errors.city}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.city?.message}
        />
      </Box>
      <Box className="lg:col-span-1">
        <InputLabel required>Número</InputLabel>
        <TextField
          type="text"
          {...register("number", { required: "Número é obrigatório" })}
          fullWidth
          error={!!errors.number}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.number?.message}
        />
      </Box>
      <Box className="lg:col-span-3">
        <InputLabel>Complemento</InputLabel>
        <TextField
          type="text"
          {...register("complement", { required: "Complemento é obrigatório" })}
          fullWidth
          error={!!errors.complement}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.complement?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel>Referência</InputLabel>
        <TextField
          type="text"
          {...register("reference", { required: "Referência é obrigatória" })}
          fullWidth
          error={!!errors.reference}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.reference?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Tipo de Moradia</InputLabel>
        <TextField
          type="text"
          {...register("housing_type", {
            required: "Tipo de moradia é obrigatório",
          })}
          fullWidth
          error={!!errors.housing_type}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.housing_type?.message}
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Endereço de Cobrança</InputLabel>
        <TextField
          type="text"
          {...register("billing_address", {
            required: "Endereço de cobrança é obrigatório",
          })}
          fullWidth
          error={!!errors.billing_address}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.billing_address?.message}
        />
      </Box>
    </div>
  );
};

export default Address;
