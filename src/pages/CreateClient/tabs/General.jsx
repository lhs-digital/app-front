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
      <Box>
        <InputLabel required>Tipo de Pessoa</InputLabel>
        <Select
          {...register("tipo_pessoa", {
            required: "Selecione o tipo de pessoa",
          })}
          readOnly={!isEditing && !isCreating}
          value={watch("tipo_pessoa") || ""}
          fullWidth
          error={!!errors.tipo_pessoa}
        >
          <MenuItem value="F">Física</MenuItem>
          <MenuItem value="J">Jurídica</MenuItem>
        </Select>
        {errors.tipo_pessoa && (
          <FormHelperText error>{errors.tipo_pessoa.message}</FormHelperText>
        )}
      </Box>
      <Box className="lg:col-span-3">
        <InputLabel required>
          {!watch("tipo_pessoa")
            ? "Nome"
            : watch("tipo_pessoa") === "F"
              ? "Nome completo"
              : "Nome fantasia"}
        </InputLabel>
        <TextField
          type="text"
          {...register("razao", { required: "Nome é obrigatório" })}
          defaultValue={data?.razao || ""}
          fullWidth
          error={!!errors.razao}
          helperText={errors.razao?.message}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>
          {watch("tipo_pessoa") === "F"
            ? "CPF"
            : watch("tipo_pessoa") === "J"
              ? "CNPJ"
              : "CPF/CNPJ"}
        </InputLabel>
        <TextField
          id="cnpj_cpf"
          type="text"
          {...register("cnpj_cpf", {
            required: "CPF/CNPJ é obrigatório",
          })}
          defaultValue={data?.cnpj_cpf || ""}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          fullWidth
          slotProps={{
            htmlInput: {
              maxLength: watch("tipo_pessoa") === "F" ? 14 : 18,
            },
          }}
          error={!!errors.cnpj_cpf}
          helperText={errors.cnpj_cpf?.message}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            let formatted = value;
            const tipo_pessoa = watch("tipo_pessoa");
            if (tipo_pessoa === "F") {
              formatted = value
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            } else if (tipo_pessoa === "J") {
              formatted = value
                .replace(/(\d{2})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1/$2")
                .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
            }
            setValue(
              "cnpj_cpf",
              formatted.slice(0, tipo_pessoa === "F" ? 14 : 18),
            );
          }}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Tipo de cliente</InputLabel>
        <Select
          {...register("tipo_cliente_scm", {
            required: "Selecione o tipo de Cliente",
          })}
          value={watch("tipo_cliente_scm") || ""}
          readOnly={!isEditing && !isCreating}
          fullWidth
          error={!!errors.tipo_cliente_scm}
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
        {errors.tipo_cliente_scm && (
          <FormHelperText error>
            {errors.tipo_cliente_scm.message}
          </FormHelperText>
        )}
      </Box>
      {watch("tipo_pessoa") === "J" && (
        <Box className="lg:col-span-2">
          <InputLabel required>Contribuinte ICMS</InputLabel>
          <Select
            {...register("contribuinte_icms", {
              required: "Selecione o contribuinte ICMS",
            })}
            value={watch("contribuinte_icms") || ""}
            readOnly={!isEditing && !isCreating}
            fullWidth
            error={!!errors.contribuinte_icms}
          >
            <MenuItem value="1">Sim</MenuItem>
            <MenuItem value="0">Não</MenuItem>
          </Select>
          {errors.contribuinte_icms && (
            <FormHelperText error>
              {errors.contribuinte_icms.message}
            </FormHelperText>
          )}
        </Box>
      )}
      {watch("tipo_pessoa") === "F" && (
        <Box className="lg:col-span-2">
          <InputLabel required>Data de Nascimento</InputLabel>
          <TextField
            type="date"
            {...register("data_nascimento", {
              required: "Data de nascimento é obrigatória",
            })}
            defaultValue={data?.data_nascimento || ""}
            InputProps={{
              readOnly: !isEditing && !isCreating,
            }}
            fullWidth
            slotProps={{
              htmlInput: { max: new Date().toISOString().split("T")[0] },
            }}
            error={!!errors.data_nascimento}
            helperText={errors.data_nascimento?.message}
          />
        </Box>
      )}
      <Box className="lg:col-span-2">
        <InputLabel required>
          {watch("tipo_pessoa") === "F"
            ? "RG"
            : watch("tipo_pessoa") === "J"
              ? "Inscrição Estadual"
              : "RG/IE"}
        </InputLabel>
        <TextField
          type="text"
          {...register("ie_identidade", {
            required:
              watch("tipo_pessoa") === "F"
                ? "RG é obrigatório"
                : "IE é obrigatório",
          })}
          defaultValue={data?.ie_identidade || ""}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          fullWidth
          error={!!errors.ie_identidade}
          helperText={errors.ie_identidade?.message}
        />
      </Box>
      <Box className="lg:col-span-2">
        <InputLabel required>Nacionalidade</InputLabel>
        <TextField
          type="text"
          {...register("nacionalidade", {
            required: "Nacionalidade é obrigatória",
          })}
          defaultValue={data?.nacionalidade || ""}
          InputProps={{
            readOnly: !isEditing && !isCreating,
          }}
          fullWidth
          error={!!errors.nacionalidade}
          helperText={errors.nacionalidade?.message}
        />
      </Box>
      {watch("tipo_pessoa") === "F" && (
        <Box className="lg:col-span-2">
          <InputLabel required>Sexo</InputLabel>
          <Select
            {...register("sexo", {
              required: "Selecione o sexo",
            })}
            value={watch("sexo") || ""}
            readOnly={!isEditing && !isCreating}
            fullWidth
            error={!!errors.sexo}
          >
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Feminino</MenuItem>
          </Select>
          {errors.sexo && (
            <FormHelperText error>{errors.sexo.message}</FormHelperText>
          )}
        </Box>
      )}
      {watch("tipo_pessoa") === "F" && (
        <Box className="lg:col-span-3">
          <InputLabel required>Profissão</InputLabel>
          <TextField
            type="text"
            {...register("profissao", {
              required: "Profissão é obrigatória",
            })}
            defaultValue={data?.profissao || ""}
            InputProps={{
              readOnly: !isEditing && !isCreating,
            }}
            fullWidth
            error={!!errors.profissao}
            helperText={errors.profissao?.message}
          />
        </Box>
      )}
      <Box className="lg:col-span-2">
        <InputLabel required>Tipo de assinante</InputLabel>
        <Select
          {...register("tipo_assinante", {
            required: "Selecione o tipo de assinante",
          })}
          value={watch("tipo_assinante") || ""}
          readOnly={!isEditing && !isCreating}
          fullWidth
          error={!!errors.tipo_assinante}
        >
          <MenuItem value="1">Comercial/Industrial</MenuItem>
          <MenuItem value="2">Poder público</MenuItem>
          <MenuItem value="3">Público</MenuItem>
          <MenuItem value="4">Residencial/Pessoa física</MenuItem>
          <MenuItem value="5">Semi-público</MenuItem>
          <MenuItem value="6">Outros</MenuItem>
        </Select>
        {errors.tipo_assinante && (
          <FormHelperText error>{errors.tipo_assinante.message}</FormHelperText>
        )}
      </Box>
      {watch("tipo_pessoa") === "J" && (
        <Box className="lg:col-span-4">
          <InputLabel>Filial</InputLabel>
          <TextField
            type="text"
            {...register("filial_id")}
            defaultValue={data?.filial_id || ""}
            InputProps={{
              readOnly: !isEditing && !isCreating,
            }}
            fullWidth
            error={!!errors.filial_id}
            helperText={errors.filial_id?.message}
          />
        </Box>
      )}
    </div>
  );
};

export default General;
