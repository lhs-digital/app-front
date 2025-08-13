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

const AddColumnRule = ({ open, onClose, submit, validations = [] }) => {
  const { register, control, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      message: "",
      validation: "",
      params: "",
      priority: "",
    },
  });
  const [ruleParams, setRuleParams] = useState(new Set());
  const [inputValue, setInputValue] = useState();
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
    if (!rule.validation) {
      toast.warn("Selecione ao menos uma condição para a regra.");
      return;
    }

    if (!rule.message || rule.message.trim() === "") {
      toast.warn("O campo de mensagem não pode estar vazio.");
      return;
    }

    if (
      ruleParams.size === 0 &&
      (selectedValidation === "in" || selectedValidation === "not_in")
    ) {
      toast.warn("Adicione pelo menos um valor para a regra.");
      return;
    }

    reset();
    setRuleParams(new Set());
    setInputValue("");
    submit({
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
    if (selectedValidation.multiple)
      return (
        <FormControl fullWidth>
          <FormLabel id="rules">Valores possíveis</FormLabel>
          <Autocomplete
            multiple
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
          />
          <FormHelperText>
            Pressione{" "}
            <span className="px-2 bg-neutral-500/30 rounded-sm mx-0.5 border border-[--border]">
              Enter
            </span>{" "}
            para adicionar um novo valor.
          </FormHelperText>
        </FormControl>
      );
    return (
      <FormControl fullWidth>
        <FormLabel id="rules">Valor de comparação</FormLabel>
        <TextField {...register("comparisonValue")} />
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
            render={({ field }) => (
              <FormControl className="col-span-1 md:col-span-2 lg:col-span-4">
                <FormLabel>Validação</FormLabel>
                <Select
                  fullWidth
                  key="validation"
                  value={field.value?.name || ""}
                  onChange={(e) => {
                    const validation = validations.find(
                      (v) => v.name === e.target.value,
                    );
                    field.onChange(validation);
                  }}
                >
                  {validations.map((validation) => (
                    <MenuItem
                      key={`${validation.id}/${validation.name}`}
                      value={validation.name}
                    >
                      {validation.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl className="col-span-1 md:col-span-2 lg:col-span-2">
                <FormLabel>Prioridade</FormLabel>
                <Select
                  fullWidth
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
              <div className="flex flex-row text-gray-400 items-center">
                <InfoOutlined className="mb-0.5 mr-2" fontSize="small" />
                <p>Sobre esta validação</p>
              </div>
              <p>{selectedValidation.description}</p>
              {selectedValidation.example && (
                <div className="mt-4">
                  <p className="text-gray-400 text-sm">Exemplo de uso</p>
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
            <FormLabel>Mensagem de erro</FormLabel>
            <TextField {...register("message")} />
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
