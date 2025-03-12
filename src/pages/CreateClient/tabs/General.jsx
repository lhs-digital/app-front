import { Box, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const General = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box>
        <InputLabel required>Tipo de Pessoa</InputLabel>
        <Select
          {...register("type", {
            required: "Selecione o tipo de pessoa",
          })}
          fullWidth
          error={!!errors.type}
        >
          <MenuItem value="F">Física</MenuItem>
          <MenuItem value="J">Jurídica</MenuItem>
        </Select>
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
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
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
          fullWidth
          error={!!errors.client_type}
        >
          <MenuItem value={1}>Comercial</MenuItem>
          <MenuItem value={2}>Industrial</MenuItem>
          <MenuItem value={3}>Residencial / Pessoa Física</MenuItem>
          <MenuItem value={4}>Produtor Rural</MenuItem>
          <MenuItem value={5}>Órgão da administração pública</MenuItem>
          <MenuItem value={6}>Prestador de serviço de telecomunicação</MenuItem>
          <MenuItem value={7}>
            Missões diplomáticas, repartições consulares e organismos
            internacionais
          </MenuItem>
          <MenuItem value={8}>Igrejas e templos de qualquer natureza</MenuItem>
          <MenuItem value={9}>Outros</MenuItem>
        </Select>
      </Box>
      {watch("type") === "J" && (
        <Box className="lg:col-span-2">
          <InputLabel required>Contribuinte ICMS</InputLabel>
          <Select
            {...register("icms_contributor", {
              required: "Selecione o contribuinte ICMS",
            })}
            fullWidth
            error={!!errors.icms_contributor}
          >
            <MenuItem value={1}>Sim</MenuItem>
            <MenuItem value={0}>Não</MenuItem>
          </Select>
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
            fullWidth
            error={!!errors.sex}
          >
            <MenuItem value={1}>Masculino</MenuItem>
            <MenuItem value={0}>Feminino</MenuItem>
          </Select>
        </Box>
      )}
      {watch("type") === "F" && (
        <Box className="lg:col-span-3">
          <InputLabel required>Profissão</InputLabel>
          <TextField
            type="text"
            {...register("nationality", {
              required: "Profissão é obrigatória",
            })}
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
          fullWidth
          error={!!errors.subscriber_type}
        >
          <MenuItem value={1}>Comercial/Industrial</MenuItem>
          <MenuItem value={2}>Poder público</MenuItem>
          <MenuItem value={3}>Público</MenuItem>
          <MenuItem value={4}>Residencial/Pessoa física</MenuItem>
          <MenuItem value={5}>Semi-público</MenuItem>
          <MenuItem value={6}>Outros</MenuItem>
        </Select>
      </Box>
      {watch("type") === "J" && (
        <Box className="lg:col-span-4">
          <InputLabel>Filial</InputLabel>
          <TextField
            type="text"
            {...register("branch")}
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
