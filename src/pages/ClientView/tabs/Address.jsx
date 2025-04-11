import { Box, InputLabel, TextField } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import { useClientForm } from "..";

const Address = ({data}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const cep = watch("cep");
  const { isEditing, isCreating } = useClientForm();

  useEffect(() => {
    if (data?.cep) {
      setValue("cep", data.cep.replace(/\D/g, ""));
    }
  }, [data, setValue]);

  const fetchAddress = async (cep) => {
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`,
      );
      if (!response.data.erro) {
        setValue("endereco", response.data.logradouro);
        setValue("bairro", response.data.bairro);
        setValue("cidade", response.data.localidade);
        setValue("complemento", response.data.complemento);
      } else {
        toast.error("CEP não encontrado");
      }
    } catch (error) {
      console.error("Erro ao buscar o endereço pelo CEP", error);
      toast.error("Erro ao buscar o endereço pelo CEP");
    }
  };

  useEffect(() => {
    if (cep && cep.length === 8 && !watch("endereco")) {
      fetchAddress(cep);
    }
  }, [cep, setValue]);

  const handleZipCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setValue("zip_code", value);

    if (value.length === 8) {
      fetchAddress(value); // Chama a função para buscar o endereço
    } else if (value.length === 0) {
      // Limpa os campos relacionados ao endereço
      setValue("endereco", "");
      setValue("bairro", "");
      setValue("cidade", "");
      setValue("complemento", "");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box className="lg:col-span-1">
        <InputLabel required>CEP</InputLabel>
        <InputMask
          mask="99999-999"
          maskChar=" "
          {...register("cep", { required: "CEP é obrigatório" })}
          onChange={handleZipCodeChange}
        >
          {(inputProps) => (
            <TextField
              {...inputProps}
              fullWidth
              error={!!errors.cep}
              InputProps={{
                readOnly: !isEditing && !isCreating,
              }}
              helperText={errors.cep?.message}
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
          {...register("endereco", { required: "Endereço é obrigatório" })}
          fullWidth
          error={!!errors.endereco}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.endereco?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Bairro</InputLabel>
        <TextField
          type="text"
          disabled
          {...register("bairro", { required: "Bairro é obrigatório" })}
          fullWidth
          error={!!errors.bairro}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.bairro?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Cidade</InputLabel>
        <TextField
          type="text"
          disabled
          {...register("cidade", { required: "Cidade é obrigatória" })}
          fullWidth
          error={!!errors.cidade}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.cidade?.message}
        />
      </Box>
      <Box className="lg:col-span-1">
        <InputLabel required>Número</InputLabel>
        <TextField
          type="text"
          {...register("numero", { required: "Número é obrigatório" })}
          fullWidth
          error={!!errors.numero}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.numero?.message}
        />
      </Box>
      <Box className="lg:col-span-3">
        <InputLabel>Complemento</InputLabel>
        <TextField
          type="text"
          {...register("complemento", {
            required: "Complemento é obrigatório",
          })}
          fullWidth
          error={!!errors.complemento}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.complemento?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel>Referência</InputLabel>
        <TextField
          type="text"
          {...register("referencia", { required: "Referência é obrigatória" })}
          fullWidth
          error={!!errors.referencia}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.referencia?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Tipo de Moradia</InputLabel>
        <TextField
          type="text"
          {...register("moradia", {
            required: "Tipo de moradia é obrigatório",
          })}
          fullWidth
          error={!!errors.moradia}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.moradia?.message}
        />
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Endereço de Cobrança</InputLabel>
        <TextField
          type="text"
          {...register("id_conta", {
            required: "Endereço de cobrança é obrigatório",
          })}
          fullWidth
          error={!!errors.id_conta}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          helperText={errors.id_conta?.message}
        />
      </Box>
    </div>
  );
};

export default Address;
