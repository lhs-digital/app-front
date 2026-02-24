import { Add, InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { priorities } from "../../../../services/utils";
import Validator from "../../../../services/validator";

const AddColumnRule = ({ open, onClose, submit, validations = [] }) => {
  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      message: "",
      validation: null,
      params: "",
      priority: "",
    },
  });
  const [ruleParams, setRuleParams] = useState(new Set());
  const [inputValue, setInputValue] = useState("");
  const selectedValidation = watch("validation");

  // Essa parte vai ser pra implementar a edição.
  // useEffect(() => {
  //   if (data) {
  //     const validation = validations.find((v) => v.name === data.validation);
  //     reset({
  //       name: data.name,
  //       message: data.message,
  //       validation: validation,
  //     });
  //     setRuleParams(new Set(data.params.split(",")));
  //   }
  // }, [data, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (rule) => {
    if (!rule?.validation) {
      toast.warn("Selecione ao menos uma condição para a regra.");
      return;
    }

    if (!rule?.message || rule?.message.trim() === "") {
      toast.warn("O campo de mensagem não pode estar vazio.");
      return;
    }

    switch (selectedValidation.name) {
      case "between":
        if (!rule.minValue || !rule.maxValue) {
          toast.warn("Preencha todos os campos para a regra entre.");
          setError("minValue");
          setError("maxValue");
          return;
        }
        if (rule.minValue > rule.maxValue) {
          toast.warn("O valor mínimo não pode ser maior que o valor máximo.");
          setError("minValue");
          return;
        }

        if (
          !Validator.isNumeric(rule.minValue.trim()) ||
          !Validator.isNumeric(rule.maxValue.trim())
        ) {
          toast.warn("Os valores devem ser numéricos.");
          setError("minValue");
          setError("maxValue");
          return;
        }

        setRuleParams(new Set([rule.minValue, rule.maxValue]));
        break;

      case "in":
        if (ruleParams.size === 0) {
          toast.warn("Adicione pelo menos um valor para a regra.");
          setError("ruleParams");
          return;
        }
        break;
      case "not_in":
        if (ruleParams.size === 0) {
          toast.warn("Adicione pelo menos um valor para a regra.");
          setError("ruleParams");
          return;
        }
        break;
    }

    reset();
    setRuleParams(new Set());
    setInputValue("");
    submit({
      name: rule.validation.name,
      validation: rule.validation,
      message: rule.message,
      params: selectedValidation?.multiple
        ? [...ruleParams].join(selectedValidation?.separator || ",")
        : rule.comparisonValue,
      priority: rule.priority || 1,
    });
    onClose();
  };

  const renderValidationField = () => {
    if (!selectedValidation) return null;
    if (selectedValidation.name === "between")
      return (
        <div className="flex flex-row gap-4">
          <FormControl fullWidth>
            <FormLabel id="rules">Valor mínimo</FormLabel>
            <TextField {...register("minValue")} error={!!errors.minValue} />
          </FormControl>
          <FormControl fullWidth>
            <FormLabel id="rules">Valor máximo</FormLabel>
            <TextField {...register("maxValue")} error={!!errors.maxValue} />
          </FormControl>
        </div>
      );
    if (selectedValidation.multiple)
      return (
        <FormControl fullWidth>
          <FormLabel id="rules">Valores possíveis</FormLabel>
          <Autocomplete
            multiple
            error={!!errors.ruleParams}
            key="rule-chips"
            options={[...ruleParams, inputValue && inputValue.trim()].filter(
              (item) => item !== "",
            )}
            noOptionsText="Digite para adicionar"
            freeSolo
            onChange={(event, value) => {
              setRuleParams((prev) => new Set([...prev, ...value]));
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === "input") {
                setInputValue(newInputValue);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && inputValue && inputValue.trim()) {
                event.preventDefault();
                event.stopPropagation();
                const newParam = inputValue.trim();
                if (!ruleParams.has(newParam)) {
                  setRuleParams((prev) => new Set([...prev, newParam]));
                  setInputValue("");
                }
              }
            }}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Comece a digitar para adicionar"
              />
            )}
            sx={{
              "& .MuiInputBase-root": {
                height: "56px",
              },
            }}
          />
          <FormHelperText>
            Pressione{" "}
            <span className="px-2 bg-zinc-500/30 rounded-sm mx-0.5 border border-[--border]">
              Enter
            </span>{" "}
            para adicionar um novo valor.
          </FormHelperText>
        </FormControl>
      );
    return (
      <FormControl fullWidth>
        <FormLabel id="rules">Valor de comparação</FormLabel>
        <TextField
          {...register("comparisonValue")}
          error={!!errors.comparisonValue}
        />
      </FormControl>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <span className="font-semibold text-lg flex items-center gap-2">
          Adicionar regra
        </span>
      </DialogTitle>
      <DialogContent>
        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 pt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="validation"
            control={control}
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl className="col-span-1 md:col-span-2 lg:col-span-4">
                <FormLabel required>Validação</FormLabel>
                <Autocomplete
                  fullWidth
                  error={!!errors.validation}
                  options={validations}
                  getOptionLabel={(option) => option?.label ?? ""}
                  getOptionKey={(option) => option?.id}
                  key="validation"
                  value={field.value ?? null}
                  onChange={(_, newValue) => {
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Selecione uma validação"
                    />
                  )}
                />
              </FormControl>
            )}
          />
          <Controller
            name="priority"
            control={control}
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl className="col-span-1 md:col-span-2 lg:col-span-2">
                <FormLabel required>Prioridade</FormLabel>
                <Select
                  fullWidth
                  error={!!errors.priority}
                  key="priority"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {priorities.map((priority) => (
                    <MenuItem
                      key={`${priority.value}/${priority.label}`}
                      value={priority.value}
                    >
                      {priority.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {selectedValidation && (
            <div className="col-span-full flex flex-col gap-2 p-4 border border-[--border] rounded-md">
              <div className="flex flex-row text-zinc-400 items-center">
                <InfoOutlined className="mb-0.5 mr-2" fontSize="inherit" />
                <p>Sobre esta validação</p>
              </div>
              <p>{selectedValidation.description}</p>
              {selectedValidation.example && (
                <div className="mt-4">
                  <p className="text-zinc-400 text-sm">Exemplo de uso</p>
                  <p>{selectedValidation.example}</p>
                </div>
              )}
            </div>
          )}
          {selectedValidation?.has_params && (
            <div className="col-span-1 md:col-span-2 lg:col-span-6">
              {renderValidationField()}
            </div>
          )}
          <FormControl className="col-span-1 md:col-span-2 lg:col-span-6">
            <FormLabel required>Mensagem de erro</FormLabel>
            <TextField
              {...register("message", { required: "Este campo é obrigatório" })}
              error={!!errors.message}
            />
            <FormHelperText>
              Mensagem que será exibida quando a regra for violada.
            </FormHelperText>
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Add />}
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          ADICIONAR REGRA
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddColumnRule;
