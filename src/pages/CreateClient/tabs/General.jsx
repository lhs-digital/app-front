import {
  Box,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useClientForm } from "..";

const General = ({ data }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const { isEditing, isCreating } = useClientForm();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      {console.log(data)}
      <Box>
        <InputLabel required>Tipo de Pessoa</InputLabel>
        <Select
          {...register("type", {
            required: "Selecione o tipo de pessoa",
          })}
          readOnly={!isEditing && !isCreating}
          value={watch("type") || ""}
          fullWidth
          error={!!errors.type}
        >
          <MenuItem value="F">Física</MenuItem>
          <MenuItem value="J">Jurídica</MenuItem>
        </Select>
        {errors.type && (
          <FormHelperText error>{errors.type.message}</FormHelperText>
        )}
      </Box>
      <Box className="lg:col-span-3">
        <InputLabel required>
          {!watch("type")
            ? "Nome"
            : watch("type") === "F"
              ? "Nome completo"
              : "Nome fantasia"}
        </InputLabel>
        <TextField
          type="text"
          {...register("name", { required: "Nome é obrigatório" })}
          defaultValue={data?.name || ""}
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>
          {watch("type") === "F"
            ? "CPF"
            : watch("type") === "J"
              ? "CNPJ"
              : "CPF/CNPJ"}
        </InputLabel>
        <TextField
          id="cnpj_cpf"
          type="text"
          {...register("cpf", {
            required: "CPF/CNPJ é obrigatório",
          })}
          defaultValue={data?.cpf || ""}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          fullWidth
          slotProps={{
            htmlInput: {
              maxLength: watch("type") === "F" ? 14 : 18,
            },
          }}
          error={!!errors.cpf}
          helperText={errors.cpf?.message}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            let formatted = value;
            const type = watch("type");
            if (type === "F") {
              formatted = value
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            } else if (type === "J") {
              formatted = value
                .replace(/(\d{2})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1/$2")
                .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
            }
            setValue("cpf", formatted.slice(0, type === "F" ? 14 : 18));
          }}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Tipo de cliente</InputLabel>
        <Select
          {...register("client_type", {
            required: "Selecione o tipo de Cliente",
          })}
          value={watch("client_type") || ""}
          readOnly={!isEditing && !isCreating}
          fullWidth
          error={!!errors.client_type}
        >
          <MenuItem value="01">Comercial</MenuItem>
          <MenuItem value="02">Industrial</MenuItem>
          <MenuItem value="03">Residencial / Pessoa Física</MenuItem>
          <MenuItem value="04">Produtor Rural</MenuItem>
          <MenuItem value="05">Órgão da administração pública</MenuItem>
          <MenuItem value="06">
            Prestador de serviço de telecomunicação
          </MenuItem>
          <MenuItem value="07">
            Missões diplomáticas, repartições consulares e organismos
            internacionais
          </MenuItem>
          <MenuItem value="08">Igrejas e templos de qualquer natureza</MenuItem>
          <MenuItem value="99">Outros</MenuItem>
        </Select>
        {errors.client_type && (
          <FormHelperText error>{errors.client_type.message}</FormHelperText>
        )}
      </Box>
      {watch("type") === "J" && (
        <Box className="lg:col-span-2">
          <InputLabel required>Contribuinte ICMS</InputLabel>
          <Select
            {...register("icms_contributor", {
              required: "Selecione o contribuinte ICMS",
            })}
            value={watch("icms_contributor") || ""}
            readOnly={!isEditing && !isCreating}
            fullWidth
            error={!!errors.icms_contributor}
          >
            <MenuItem value="1">Sim</MenuItem>
            <MenuItem value="0">Não</MenuItem>
          </Select>
          {errors.icms_contributor && (
            <FormHelperText error>
              {errors.icms_contributor.message}
            </FormHelperText>
          )}
        </Box>
      )}
      {watch("type") === "F" && (
        <Box className="lg:col-span-2">
          <InputLabel required>Data de Nascimento</InputLabel>
          <TextField
            type="date"
            {...register("birth_date", {
              required: "Data de nascimento é obrigatória",
            })}
            defaultValue={data?.birth_date || ""}
            InputProps={{
              readOnly: !isEditing && !isCreating,
            }}
            fullWidth
            slotProps={{
              htmlInput: { max: new Date().toISOString().split("T")[0] },
            }}
            error={!!errors.birth_date}
            helperText={errors.birth_date?.message}
          />
        </Box>
      )}
      <Box className="lg:col-span-2">
        <InputLabel required>
          {watch("type") === "F"
            ? "RG"
            : watch("type") === "J"
              ? "Inscrição Estadual"
              : "RG/IE"}
        </InputLabel>
        <TextField
          type="text"
          {...register("ie_rg", {
            required:
              watch("type") === "F" ? "RG é obrigatório" : "IE é obrigatório",
          })}
          defaultValue={data?.ie_rg || ""}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          fullWidth
          error={!!errors.ie_rg}
          helperText={errors.ie_rg?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Nacionalidade</InputLabel>
        <TextField
          type="text"
          {...register("nationality", {
            required: "Nacionalidade é obrigatória",
          })}
          defaultValue={data?.nationality || ""}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          fullWidth
          error={!!errors.nationality}
          helperText={errors.nationality?.message}
        />
      </Box>
      {watch("type") === "F" && (
        <Box className="lg:col-span-2">
          <InputLabel required>Sexo</InputLabel>
          <Select
            {...register("sex", {
              required: "Selecione o sexo",
            })}
            value={watch("sex") || ""}
            readOnly={!isEditing && !isCreating}
            fullWidth
            error={!!errors.sex}
          >
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Feminino</MenuItem>
          </Select>
          {errors.sex && (
            <FormHelperText error>{errors.sex.message}</FormHelperText>
          )}
        </Box>
      )}
      {watch("type") === "F" && (
        <Box className="lg:col-span-3">
          <InputLabel required>Profissão</InputLabel>
          <TextField
            type="text"
            {...register("profession", {
              required: "Profissão é obrigatória",
            })}
            defaultValue={data?.profession || ""}
            InputProps={{
              readOnly: !isEditing && !isCreating,
            }}
            fullWidth
            error={!!errors.profession}
            helperText={errors.profession?.message}
          />
        </Box>
      )}
      <Box className="lg:col-span-2">
        <InputLabel required>Tipo de assinante</InputLabel>
        <Select
          {...register("subscriber_type", {
            required: "Selecione o tipo de assinante",
          })}
          value={watch("subscriber_type") || ""}
          readOnly={!isEditing && !isCreating}
          fullWidth
          error={!!errors.subscriber_type}
        >
          <MenuItem value="1">Comercial/Industrial</MenuItem>
          <MenuItem value="2">Poder público</MenuItem>
          <MenuItem value="3">Público</MenuItem>
          <MenuItem value="4">Residencial/Pessoa física</MenuItem>
          <MenuItem value="5">Semi-público</MenuItem>
          <MenuItem value="6">Outros</MenuItem>
        </Select>
        {errors.subscriber_type && (
          <FormHelperText error>
            {errors.subscriber_type.message}
          </FormHelperText>
        )}
      </Box>
      {watch("type") === "J" && (
        <Box className="lg:col-span-4">
          <InputLabel>Filial</InputLabel>
          <TextField
            type="text"
            {...register("branch")}
            defaultValue={data?.branch || ""}
            InputProps={{
              readOnly: !isEditing && !isCreating,
            }}
            fullWidth
            error={!!errors.branch}
            helperText={errors.branch?.message}
          />
        </Box>
      )}
    </div>
  );
};

export default General;
