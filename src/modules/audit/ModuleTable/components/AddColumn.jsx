import {
  Add,
  Check,
  InfoOutlined,
  Remove,
  RuleFolderOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
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
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Validation from "../../../../components/AuditComponents/Validation";
import { priorities, validations } from "../../../../services/utils";

export const AddColumn = ({
  open,
  onClose,
  column,
  onAddColumn,
  onEditColumn,
  onRemoveColumn,
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
    setValue,
    formState: { errors },
    resetField,
  } = useForm({
    defaultValues: {
      name: "",
      label: "",
      priority: "",
      size: "",
      type: "",
      help_text: "",
      placeholder: "",
      rule: {
        name: "",
        message: "",
        params: "",
      },
    },
  });

  useEffect(() => {
    if (column) {
      setValue("name", column.name || "");
      setValue("label", column.label || "");
      setValue("priority", column.priority || "");
      setValue("size", column.size || "");
      setValue("type", column.type || "");
      setValue("help_text", column.help_text || "");
      setValue("placeholder", column.placeholder || "");
      if (column.rules && Object.keys(column.rules).length > 0) {
        const formattedRules = column.rules.map((validation) => {
          if (validation.params) {
            const paramArray = validation.params.split(",");
            setRuleParams((prev) => new Set([...prev, ...paramArray]));
          }

          return {
            id: validation.id,
            name: validation.name,
            message: validation.message,
            params: validation.params || "",
            priority: validation.priority || "",
          };
        });

        setRules(formattedRules);
      }
    }
  }, [column]);

  const selectedValidation = watch("rule.name")?.split("/")[1];

  const renderValidationField = () => {
    const validation = validations.find(
      (validation) => validation.name === selectedValidation,
    );
    if (!validation) return null;
    if (validation.field === "array")
      return (
        <FormControl fullWidth>
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

  const onSubmit = (formData) => {
    if (Object.keys(errors).length > 0) {
      return toast.error("Preencha todos os campos corretamente");
    }

    const formattedData = {
      ...column,
      name: formData.name,
      label: formData.label,
      size: formData.size,
      type: formData.type,
      help_text: formData.help_text,
      placeholder: formData.placeholder,
      rules: rules,
      // rules: rules.reduce((acc, rule) => {
      //   acc[rule.id] = {
      //     message: rule.message,
      //     params: rule.params,
      //   };
      //   return acc;
      // }, {}),
    };

    if (column?.edit) {
      onEditColumn(formattedData);
    } else {
      onAddColumn(formattedData);
    }
  };

  const addRule = () => {
    const { rule } = getValues();

    if (!rule.name || rule.name.trim() === "") {
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

    const newRule = {
      // Não incluir ID para regras novas - deixar o backend gerar
      name: rule.name.split("/")[1],
      message: rule.message,
      params: [...ruleParams].join(","),
      priority: rule.priority || 1,
    };

    setRules((prev) => [...prev, newRule]);
    resetField("rule.name");
    resetField("rule.message");
    resetField("rule.params");
    setRuleParams(new Set());
    setInputValue("");
  };

  const removeRule = (rule) => {
    setRules((prev) =>
      prev.filter((r) => {
        // Para regras com ID, comparar por ID
        if (r.id && rule.id) {
          return r.id !== rule.id;
        }
        // Para regras sem ID, comparar por name e message (identificação única)
        return !(r.name === rule.name && r.message === rule.message);
      }),
    );
    setRuleParams((prev) => {
      const newParams = new Set([...prev]);
      if (rule.params) {
        rule.params.split(",").forEach((param) => {
          newParams.delete(param.trim());
        });
      }
      return newParams;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle>
        {column && !column.edit ? "Adicionar coluna" : "Editar coluna"}
      </DialogTitle>
      <DialogContent>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 w-full">
          <h2 className="font-semibold col-span-6 text-lg mb-2">
            <span>
              <TextSnippetOutlined fontSize="small" className="mb-0.5" />
            </span>{" "}
            Informações da coluna
          </h2>
          <FormControl className="lg:col-span-2">
            <FormLabel>Nome da coluna</FormLabel>
            <TextField value={column?.name} disabled {...register(`name`)} />
          </FormControl>
          <FormControl className="lg:col-span-4">
            <FormLabel required>
              Nome de visualização{" "}
              <span className="text-neutral-500 cursor-pointer">
                <Tooltip
                  title="Nome que será exibido na interface do usuário."
                  arrow
                >
                  <InfoOutlined fontSize="12px" className="mb-0.5" />
                </Tooltip>
              </span>
            </FormLabel>
            <TextField
              {...register(`label`, {
                required: "Este campo é obrigatório",
              })}
            />
          </FormControl>
          <Controller
            name={`size`}
            control={control}
            render={({ field }) => (
              <FormControl className="lg:col-span-3">
                <FormLabel>
                  Tamanho{" "}
                  <span className="text-neutral-500 cursor-pointer">
                    <Tooltip
                      title="Tamanho do campo a ser exibido no formulário."
                      arrow
                    >
                      <InfoOutlined fontSize="12px" className="mb-0.5" />
                    </Tooltip>
                  </span>
                </FormLabel>
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="grow">Máximo disponível</MenuItem>
                  <MenuItem value="small">Pequeno</MenuItem>
                  <MenuItem value="medium">Médio</MenuItem>
                  <MenuItem value="large">Grande</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name={`type`}
            control={control}
            render={({ field }) => (
              <FormControl className="lg:col-span-3">
                <FormLabel>Tipo de campo</FormLabel>
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <MenuItem value="date">Data</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="number">Número</MenuItem>
                  <MenuItem value="select">Select</MenuItem>
                  <MenuItem value="tel">Telefone</MenuItem>
                  <MenuItem value="text">Texto</MenuItem>
                  <MenuItem value="textarea">Textarea</MenuItem>
                  <MenuItem value="url">URL</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <FormControl className="lg:col-span-6">
            <FormLabel>
              Texto de ajuda{" "}
              <span className="text-neutral-500 cursor-pointer">
                <Tooltip
                  title="Texto que será exibido como ajuda para o usuário."
                  arrow
                >
                  <InfoOutlined fontSize="12px" className="mb-0.5" />
                </Tooltip>
              </span>
            </FormLabel>
            <TextField {...register(`help_text`)} />
          </FormControl>
          <FormControl className="lg:col-span-6">
            <FormLabel>
              Texto placeholder{" "}
              <span className="text-neutral-500 cursor-pointer">
                <Tooltip
                  title="Opcional. Texto para indicar ao usuário o que deve ser digitado no campo."
                  arrow
                >
                  <InfoOutlined fontSize="12px" className="mb-0.5" />
                </Tooltip>
              </span>
            </FormLabel>
            <TextField {...register(`placeholder`)} />
          </FormControl>
          <Divider className="col-span-full" />
          <h2 className="font-semibold col-span-6 text-lg mb-2">
            <span>
              <RuleFolderOutlined fontSize="small" className="mb-0.5" />
            </span>{" "}
            Regras de auditoria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 col-span-full p-4 border border-[--border] rounded-md">
            <h3 className="col-span-6">Nova regra</h3>
            <Controller
              name="rule.name"
              control={control}
              render={({ field }) => (
                <FormControl className="col-span-1 md:col-span-2 lg:col-span-4">
                  <FormLabel>Condição</FormLabel>
                  <Select
                    fullWidth
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
            <Controller
              name="rule.priority"
              control={control}
              render={({ field }) => (
                <FormControl className="col-span-1 md:col-span-2 lg:col-span-2">
                  <FormLabel>Prioridade</FormLabel>
                  <Select
                    fullWidth
                    key="validation"
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
            <div className="col-span-1 md:col-span-2 lg:col-span-6">
              {renderValidationField()}
            </div>
            <FormControl className="col-span-1 md:col-span-2 lg:col-span-6">
              <FormLabel>Mensagem de erro</FormLabel>
              <TextField {...register("rule.message")} />
              <FormHelperText>
                Mensagem que será exibida quando a regra for violada.
              </FormHelperText>
            </FormControl>
            <Button
              startIcon={<Add />}
              onClick={addRule}
              className="col-span-6"
            >
              ADICIONAR REGRA
            </Button>
          </div>
          <div className="col-span-full p-4 border border-[--border] rounded-md flex flex-col gap-4">
            <div className="col-span-full">
              <h2>Regras adicionadas</h2>
              <p className="text-sm text-gray-500 mb-2">
                Passe o mouse sobre uma regra para ver mais detalhes.
              </p>
            </div>
            <div className="flex flex-row gap-2 items-center col-span-6">
              {rules.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Não há regras adicionadas.
                </p>
              ) : (
                rules.map((rule, index) => (
                  <Validation
                    key={rule.id ? `rule-${rule.id}` : `${rule.name}-${index}`}
                    rule={rule}
                    params={rule.params}
                    onDelete={() => removeRule(rule)}
                  />
                ))
              )}
            </div>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        {column?.edit && (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Remove />}
            onClick={() => onRemoveColumn(column)}
          >
            Remover coluna
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={column?.edit ? <Check /> : <Add />}
          onClick={handleSubmit(onSubmit)}
        >
          {column?.edit ? "Atualizar coluna" : "Adicionar coluna"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddColumn;
