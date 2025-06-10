import { Add, Close, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { priorities, validations } from "../../../../services/utils";
import Validation from "./Validation";

const AddRule = ({
  open = true,
  onClose = () => {},
  submit = () => {},
  data,
}) => {
  const [rules, setRules] = useState([]);
  const [ruleParams, setRuleParams] = useState(new Set());
  const [inputValue, setInputValue] = useState();
  const {
    register,
    getValues,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    resetField,
  } = useForm({
    defaultValues: {
      column: {
        name: "",
        priority: 0,
        label: "",
      },
      rule: {
        name: "",
        message: "",
        params: "",
      },
    },
  });
  const selectedValidation = watch("rule.name")?.split("/")[1];

  const renderValidationField = () => {
    const validation = validations.find(
      (validation) => validation.name === selectedValidation,
    );
    if (!validation) return null;
    if (validation.field === "array")
      return (
        <FormControl>
          <FormLabel id="company-label">Valores possíveis</FormLabel>
          <Autocomplete
            multiple
            key="rule-chips"
            options={[...ruleParams, inputValue && inputValue.trim()].filter(
              (item) => item !== "",
            )}
            noOptionsText="Digite para adicionar"
            onChange={(event, value) => {
              setRuleParams((prev) => new Set([...prev, ...value]));
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Comece a digitar para adicionar"
              />
            )}
          />
        </FormControl>
      );
  };

  useEffect(() => {
    if (data) {
      console.log("addRule", data);
      reset({
        column: {
          name: data.name || "",
          priority: data.priority || 0,
          label: data.label || "",
        },
        rule: {
          name: "",
          message: "",
          params: "",
        },
      });

      if (data.validations && data.validations.length > 0) {
        const formattedRules = data.validations.map((validation) => {
          if (validation.rule.has_params && validation.params) {
            const paramArray = validation.params.split(",");
            setRuleParams((prev) => new Set([...prev, ...paramArray]));
          }

          return {
            id: validation.rule.id,
            name: validation.rule.name,
            message: validation.message,
            params: validation.params || "",
          };
        });

        console.log("formattedRules", formattedRules);

        setRules(formattedRules);
      }
    }
  }, [data, reset]);

  const onSubmit = (formData) => {
    if (Object.keys(errors).length > 0) {
      console.error("errors", errors);
      return toast.error("Preencha todos os campos corretamente");
    }

    const formattedData = {
      id: data?.id,
      column: {
        name: formData.column?.name,
        priority: formData.column?.priority,
        label: formData.column?.label,
        company_table_id: data?.company_table_id,
      },
      rules: rules.reduce((acc, rule) => {
        acc[rule.id] = {
          message: rule.message,
          params: rule.params,
        };
        return acc;
      }, {}),
    };
    submit(formattedData);
  };

  const addRule = () => {
    const data = getValues();
    if (!data.rule.name || !data.rule.message) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    if (
      ruleParams.size === 0 &&
      (selectedValidation === "in" || selectedValidation === "not_in")
    ) {
      toast.error("Adicione pelo menos um valor para a regra.");
      return;
    }

    const rule = {
      id: data.rule.name.split("/")[0],
      name: data.rule.name.split("/")[1],
      message: data.rule.message,
      params: [...ruleParams].join(","),
    };
    setRules((prev) => [...prev, rule]);
    resetField("rule.name");
    resetField("rule.message");
    resetField("rule.params");
    setRuleParams(new Set());
    setInputValue("");
  };

  const removeRule = (rule) => {
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
    setRuleParams((prev) => {
      const newParams = new Set([...prev]);
      rule.params.split(",").forEach((param) => {
        newParams.delete(param.trim());
      });
      return newParams;
    });
  };

  const handleClose = () => {
    setRules([]);
    setRuleParams(new Set());
    setInputValue("");
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      scroll="body"
    >
      <DialogTitle>
        {data !== null ? "Editar coluna" : "Adicionar coluna"}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <form
          id="rule-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormControl error={!!errors?.column?.name}>
            <FormLabel required>Nome da coluna</FormLabel>
            <TextField
              {...register("column.name", {
                required: "Este campo é obrigatório",
              })}
              error={!!errors?.column?.name}
            />
            <FormHelperText>
              Deve ser o mesmo nome da coluna no banco de dados.
            </FormHelperText>
          </FormControl>
          <FormControl error={!!errors?.column?.label}>
            <FormLabel required>Nome de visualização</FormLabel>
            <TextField
              {...register("column.label", {
                required: "Este campo é obrigatório",
              })}
              error={!!errors?.column?.label}
            />
            <FormHelperText>
              Nome que será exibido na interface do usuário.
            </FormHelperText>
          </FormControl>
          <Controller
            name="column.priority"
            control={control}
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl className="grow" error={!!errors?.column?.priority}>
                <FormLabel required>Prioridade da coluna</FormLabel>
                <Select
                  key="priority"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors?.column?.priority}
                >
                  {priorities.map((severity, index) => (
                    <MenuItem
                      key={`${severity.name}-priority-${index}`}
                      value={severity.value}
                    >
                      {severity.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <div className="flex flex-col gap-4 border-t border-[--border] pt-4">
            <h2 className="font-semibold">Configurações de formulário</h2>
            <FormControl>
              <FormLabel>Tipo de campo</FormLabel>
              <Select>
                <MenuItem value="autocomplete">Autocomplete</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="combobox">Combobox</MenuItem>
                <MenuItem value="cpf-cnpj">CPF/CNPJ</MenuItem>
                <MenuItem value="date">Data</MenuItem>
                <MenuItem value="datetime">Data e hora</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="file">Arquivo</MenuItem>
                <MenuItem value="number">Número</MenuItem>
                <MenuItem value="radio">Radio</MenuItem>
                <MenuItem value="search">Search</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="tel">Telefone</MenuItem>
                <MenuItem value="text">Texto</MenuItem>
                <MenuItem value="textarea">Textarea</MenuItem>
                <MenuItem value="time">Hora</MenuItem>
                <MenuItem value="url">URL</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Tamanho</FormLabel>
              <Select>
                <MenuItem value="grow">Máximo disponível</MenuItem>
                <MenuItem value="small">Pequeno</MenuItem>
                <MenuItem value="medium">Médio</MenuItem>
                <MenuItem value="large">Grande</MenuItem>
              </Select>
              <FormHelperText>
                Tamanho do campo a ser exibido no formulário da tabela em que se
                encontra a coluna.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Texto de ajuda</FormLabel>
              <TextField {...register("column.help_text")} />
              <FormHelperText>
                Texto que será exibido como ajuda para o usuário.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Texto placeholder</FormLabel>
              <TextField {...register("column.placeholder")} />
              <FormHelperText>
                Opcional. Texto para indicar ao usuário o que deve ser digitado
                no campo.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Propriedades</FormLabel>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Campo de busca"
                />
                <FormControlLabel
                  control={<Checkbox />}
                  label="Foco automático"
                />
              </FormGroup>
            </FormControl>
          </div>
          <div className="flex flex-col gap-4 border-t border-[--border] pt-4">
            <h2 className="font-semibold">Nova regra</h2>
            <Controller
              name="rule.name"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Condição</FormLabel>
                  <Select
                    key="validation"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {validations.map((validation) => (
                      <MenuItem
                        key={`${validation.id}/${validation.name}`}
                        value={`${validation.id}/${validation.name}`}
                      >
                        {validation.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {field.value &&
                      validations.find(
                        (c) => c.name === field.value.split("/")[1],
                      )?.description}
                  </FormHelperText>
                </FormControl>
              )}
            />
            {renderValidationField()}
            <FormControl>
              <FormLabel>Mensagem de erro</FormLabel>
              <TextField {...register("rule.message")} />
              <FormHelperText>
                Mensagem que será exibida quando a regra for violada.
              </FormHelperText>
            </FormControl>
          </div>
          <Button variant="outlined" startIcon={<Add />} onClick={addRule}>
            ADICIONAR
          </Button>
          <Divider />
          <h2 className="font-semibold">Regras</h2>
          <div className="flex flex-row gap-2 items-center">
            {rules.length === 0 ? (
              <p className="text-sm text-gray-400">
                Não há regras adicionadas.
              </p>
            ) : (
              rules.map((rule, index) => (
                <Validation
                  key={`${rule.name}-${index}`}
                  rule={rule}
                  params={rule.params}
                  onDelete={() => removeRule(rule)}
                />
              ))
            )}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleClose}
          color="error"
          startIcon={<Close />}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          type="submit"
          form="rule-form"
          color="primary"
          startIcon={<Save />}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRule;
