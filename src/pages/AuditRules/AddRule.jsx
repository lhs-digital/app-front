import { Add, Close, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { priorities, validations } from "../../services/utils";
import Validation from "./Validation";

// REQUEST OBJECT REFERENCE
// {
//     "column": {
//         "name": "tipo_moradia",
//         "priority": 0,
//         "label": "Tipo de Moradia"
//     },
//     "rules": {
//         "2": {
//             "message": "Alguma mensagem.",
//             "params": "A,B,C"
//         }
//     }
// }

const AddRule = ({ open = true, onClose = () => {} }) => {
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

  const onSubmit = (data) => {
    if (Object.keys(errors).length > 0) {
      console.error("errors", errors);
      return toast.error("Preencha todos os campos corretamente");
    }

    const formattedData = {
      column: {
        name: data.column?.name,
        priority: data.column?.priority,
        label: data.column?.label,
      },
      rules: rules.reduce((acc, rule) => {
        const ruleKey = Object.keys(rule)[0];
        acc[ruleKey] = {
          message: rule[ruleKey].message,
          params: rule[ruleKey].params,
        };
        return acc;
      }, {}),
    };
    console.log(formattedData);
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
      name: data.rule.name.split("/")[1],
      message: data.rule.message,
      params: [...ruleParams].join(","),
    };
    console.log("new rule", rule);
    setRules((prev) => [...prev, rule]);
    resetField("rule.name");
    resetField("rule.message");
    resetField("rule.params");
    setRuleParams(new Set());
    setInputValue("");
  };

  const handleClose = () => {
    setRules([]);
    setRuleParams(new Set());
    setInputValue("");
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Regra</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <form
          id="rule-form"
          onSubmit={handleSubmit(handleSubmit)}
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
          <div className="flex flex-col gap-2 border-t border-[--border] pt-4">
            <h2 className="font-semibold">Nova regra</h2>
            <Controller
              name="rule.name"
              control={control}
              rules={{ required: "Este campo é obrigatório" }}
              render={({ field }) => (
                <FormControl error={!!errors?.rule?.name}>
                  <FormLabel required>Condição</FormLabel>
                  <Select
                    key="validation"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    error={!!errors?.rule?.name}
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
            <FormControl error={!!errors?.column?.message}>
              <FormLabel required>Mensagem de erro</FormLabel>
              <TextField
                {...register("rule.message", {
                  required: "Este campo é obrigatório",
                })}
                error={!!errors?.column?.message}
              />
              <FormHelperText>
                Mensagem que será exibida quando a regra for violada.
              </FormHelperText>
            </FormControl>
          </div>
          <Button variant="outlined" startIcon={<Add />} onClick={addRule}>
            ADICIONAR
          </Button>
          <Divider />
          <h2 className="font-semibold">Regras adicionadas</h2>
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
          onClick={() => {}}
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
