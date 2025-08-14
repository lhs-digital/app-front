import {
  Add,
  Check,
  Remove,
  RuleFolderOutlined,
  TextSnippetOutlined,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Validation from "../../../../components/AuditComponents/Validation";
import Info from "../../../../components/Miscellaneous/Info";
import api from "../../../../services/api";
import { formatBackendRulesToFrontend } from "../../../../services/formatters";
import AddColumnRule from "./AddColumnRule";
import AddSelectOptions from "./AddSelectOptions";
import OptionChip from "./OptionChip";

export const AddColumn = ({
  open,
  onClose,
  column,
  onAddColumn,
  onEditColumn,
  onRemoveColumn,
}) => {
  const [options, setOptions] = useState([]);
  const [openAddOption, setOpenAddOption] = useState(false);
  const [rules, setRules] = useState([]);
  const [availableRules, setAvailableRules] = useState([]);
  const [openAddRule, setOpenAddRule] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      label: "",
      priority: "",
      form: {
        placeholder: "",
        help_text: "",
        size: "",
        type: "",
        options: [],
      },
      rule: {
        name: "",
        message: "",
        params: "",
      },
    },
  });

  const { data: validations = [], isLoading: loadingValidations } = useQuery({
    queryKey: ["validations"],
    queryFn: async () => {
      const response = await api.get("/rules");
      setAvailableRules(response.data.data);
      return response.data.data;
    },
  });

  useEffect(() => {
    if (!loadingValidations && !column) {
      // Only filter rules when not editing a column to avoid conflicts
      const usedRuleIds = rules
        .map((rule) => rule.validation?.id)
        .filter(Boolean);
      const filtered = validations.filter(
        (validation) => !usedRuleIds.includes(validation.id),
      );
      setAvailableRules(filtered);
    }
  }, [rules, loadingValidations, column, validations]);

  useEffect(() => {
    if (column && validations.length > 0 && !loadingValidations) {
      setValue("name", column.name || "");
      setValue("label", column.label || "");
      setValue("priority", column.priority || "");
      setValue("form.size", column.form?.size || "");
      setValue("form.type", column.form?.type || "");
      setOptions(column.form?.options || []);
      setValue("form.help_text", column.form?.help_text || "");
      setValue("form.placeholder", column.form?.placeholder || "");

      const formattedRules = formatBackendRulesToFrontend(
        column.rules,
        validations,
      );
      console.log("Formatted rules:", formattedRules);
      setRules(formattedRules);

      // Update available rules by filtering out used ones
      if (formattedRules.length > 0) {
        const usedRuleNames = formattedRules.map((rule) => rule.name);
        const filtered = validations.filter(
          (validation) => !usedRuleNames.includes(validation.name),
        );
        setAvailableRules(filtered);
      } else {
        setAvailableRules(validations);
      }
    } else if (!column) {
      setRules([]);
      setAvailableRules(validations);
      reset();
    }
  }, [column, setValue, validations]);
  const onSubmit = (formData) => {
    if (Object.keys(errors).length > 0) {
      return toast.error("Preencha todos os campos corretamente");
    }

    if (watch("form.type") === "select" && options.length === 0) {
      return toast.error("Adicione pelo menos uma opção para o campo select.");
    }

    if (rules.length === 0) {
      return toast.error("Adicione pelo menos uma regra para a coluna.");
    }

    const formattedData = {
      ...column,
      name: formData.name,
      label: formData.label,
      form: {
        size: formData.form.size,
        type: formData.form.type,
        options: options,
        help_text: formData.form.help_text,
        placeholder: formData.form.placeholder,
      },
      rules: rules,
    };

    if (column?.edit) {
      onEditColumn(formattedData);
    } else {
      onAddColumn(formattedData);
    }
  };

  const addRule = (rule) => {
    setRules((prev) => [...prev, rule]);
    setAvailableRules((prev) =>
      prev.filter((validation) => validation.name !== rule.validation.name),
    );
  };

  const handleAddOption = (newOption) => {
    setOptions((prev) => [...prev, newOption]);
  };

  const handleDeleteOption = (index) => {
    setOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
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

    // Add the validation back to available rules
    if (rule.validation) {
      setAvailableRules((prev) => {
        const exists = prev.some(
          (validation) => validation.name === rule.validation.name,
        );
        if (!exists) {
          return [...prev, rule.validation];
        }
        return prev;
      });
    }
  };

  const handleClose = () => {
    setRules([]);
    setAvailableRules(validations);
    reset();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        scroll="body"
      >
        <DialogTitle>
          {column && !column.edit
            ? "Criar regras para a coluna"
            : "Editar regras da coluna"}
        </DialogTitle>
        <DialogContent>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 w-full">
            <h2 className="font-semibold col-span-6 text-lg mb-2">
              <span>
                <TextSnippetOutlined fontSize="small" className="mb-0.5" />
              </span>{" "}
              Informações gerais
            </h2>
            <FormControl className="lg:col-span-2">
              <FormLabel>Nome da coluna</FormLabel>
              <TextField value={column?.name} disabled {...register("name", { required: "Nome da coluna é obrigatório" })} />
            </FormControl>
            <FormControl className="lg:col-span-4">
              <FormLabel className="flex flex-row items-center">
                Nome de visualização
                <Info description="Nome que será exibido na interface do usuário." />
              </FormLabel>
              <TextField
                {...register(`label`, {
                  required: "Este campo é obrigatório",
                })}
              />
            </FormControl>
            <Controller
              name={`form.size`}
              control={control}
              rules={{ required: "Tamanho é obrigatório" }}
              render={({ field }) => (
                <FormControl className="lg:col-span-3">
                  <FormLabel className="flex flex-row items-center">
                    Tamanho
                    <Info description="Tamanho do campo a ser exibido no formulário." />
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
              name={`form.type`}
              control={control}
              rules={{ required: "Tipo de campo é obrigatório" }}
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
            {watch("form.type") === "select" && (
              <>
                <div className="col-span-full flex flex-row justify-between">
                  <div>
                    <h2 className="font-semibold col-span-full text-lg mb-2">
                      <span>
                        <RuleFolderOutlined fontSize="small" className="mb-0.5" />
                      </span>{" "}
                      Opções
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      Lista de opções disponíveis para este campo select.
                    </p>
                  </div>
                </div>

                <div className="flex flex-row flex-wrap gap-2 items-center col-span-6">
                  {options.length === 0 ? (
                    <p className="text-sm text-gray-400">Não há opções adicionadas.</p>
                  ) : (
                    options.map((opt, idx) => (
                      <OptionChip
                        key={opt.value}
                        option={opt}
                        onDelete={() => handleDeleteOption(idx)}
                        clickable
                      />
                    ))
                  )}

                  <Tooltip
                    title={<p className="text-sm">Adicionar opção</p>}
                    placement="auto-end"
                    arrow
                  >
                    <Button
                      onClick={() => setOpenAddOption(true)}
                      variant="contained"
                      sx={{
                        aspectRatio: "1 / 1",
                        padding: "0px",
                        minHeight: "32px",
                        minWidth: "32px",
                        borderRadius: "100%",
                      }}
                    >
                      <Add fontSize="small" />
                    </Button>
                  </Tooltip>
                </div>
              </>
            )}
            <FormControl className="lg:col-span-6">
              <FormLabel className="flex flex-row items-center">
                Texto de ajuda
                <Info description="Texto que será exibido como ajuda para o usuário." />
              </FormLabel>
              <TextField {...register("form.help_text", { required: "Texto de ajuda é obrigatório" })} />
            </FormControl>
            <FormControl className="lg:col-span-6">
              <FormLabel className="flex flex-row items-center">
                Texto placeholder
                <Info description="Opcional. Texto para indicar ao usuário o que deve ser digitado no campo." />
              </FormLabel>
              <TextField {...register("form.placeholder", { required: "Placeholder é obrigatório" })} />
            </FormControl>
            <Divider className="col-span-full" />
            <div className="col-span-full flex flex-row justify-between">
              <div>
                <h2 className="font-semibold col-span-full text-lg mb-2">
                  <span>
                    <RuleFolderOutlined fontSize="small" className="mb-0.5" />
                  </span>{" "}
                  Regras
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Passe o mouse sobre uma regra para ver mais detalhes.
                </p>
              </div>
            </div>
            <div className="flex flex-row flex-wrap gap-2 items-center col-span-6">
              {rules.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Não há regras adicionadas.
                </p>
              ) : (
                rules.map((rule, index) => (
                  <Validation
                    key={rule.id ? `rule-${rule.id}` : `${rule.name}-${index}`}
                    rule={rule}
                    onDelete={() => removeRule(rule)}
                  />
                ))
              )}

              <Tooltip
                title={<p className="text-sm">Adicionar regra</p>}
                placement="auto-end"
                arrow
              >
                <Button
                  onClick={() => setOpenAddRule(true)}
                  variant="contained"
                  sx={{
                    aspectRatio: "1 / 1",
                    padding: "0px",
                    minHeight: "32px",
                    minWidth: "32px",
                    borderRadius: "100%",
                  }}
                >
                  <Add fontSize="small" />
                </Button>
              </Tooltip>
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
            onClick={handleSubmit(
              onSubmit,
              () => toast.error("Preencha todos os campos corretamente")
            )}
          >
            {column?.edit ? "Atualizar coluna" : "Adicionar coluna"}
          </Button>
        </DialogActions>
      </Dialog >
      <AddColumnRule
        open={openAddRule}
        validations={availableRules}
        onClose={() => setOpenAddRule(false)}
        submit={addRule}
      />
      <AddSelectOptions
        open={openAddOption}
        options={options}
        setOptions={setOptions}
        onClose={() => {
          setOpenAddOption(false);
        }}
        submit={handleAddOption}
      />
    </>
  );
};

export default AddColumn;
