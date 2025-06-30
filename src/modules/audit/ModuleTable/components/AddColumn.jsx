import { Add, InfoOutlined, Remove, Save } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../components/FormField";
import { priorities } from "../../../../services/utils";

export const AddColumn = ({
  open,
  onClose,
  column,
  onAddColumn,
  onEditColumn,
  onRemoveColumn,
}) => {
  const { register, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      label: "",
      priority: "",
      size: "",
      type: "",
      help_text: "",
      placeholder: "",
      is_search: false,
      is_auto_focus: false,
    },
  });

  useEffect(() => {
    if (column) {
      setValue("name", column.name);
      setValue("label", column.label);
      setValue("priority", column.priority);
      setValue("size", column.size);
      setValue("type", column.type);
      setValue("help_text", column.help_text);
      setValue("placeholder", column.placeholder);
      setValue("is_search", column.is_search);
    }
  }, [column]);

  const onSubmit = (data) => {
    if (column?.edit) {
      onEditColumn({ ...column, ...data, edit: false });
    } else {
      onAddColumn({
        ...column,
        ...data,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {column && !column.edit ? "Adicionar coluna" : "Editar coluna"}
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 w-full"
        >
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
            name={`priority`}
            control={control}
            rules={{ required: "Este campo é obrigatório" }}
            render={({ field }) => (
              <FormControl className="grow lg:col-span-2">
                <FormLabel required>Prioridade da coluna</FormLabel>
                <Select
                  key="priority"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
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
          <Controller
            name={`size`}
            control={control}
            render={({ field }) => (
              <FormControl className="lg:col-span-2">
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
              <FormControl className="lg:col-span-2">
                <FormLabel>Tipo de campo</FormLabel>
                <Select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
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
            )}
          />
          <FormControl className="lg:col-span-3">
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
          <FormControl className="lg:col-span-3">
            <FormLabel>
              Texto placeholder{" "}
              <span className="text-neutral-500 cursor-pointer">
                <Tooltip
                  title="Opcional. Texto para indicar ao usuário o que deve ser digitado no
          campo."
                  arrow
                >
                  <InfoOutlined fontSize="12px" className="mb-0.5" />
                </Tooltip>
              </span>
            </FormLabel>
            <TextField {...register(`placeholder`)} />
          </FormControl>
          <FormField label="Propriedades" containerClass="lg:col-span-6">
            <div className="flex flex-row gap-2">
              <FormControlLabel
                control={<Checkbox />}
                label="Campo de busca"
                {...register(`is_search`)}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Foco automático"
                {...register(`is_auto_focus`)}
              />
            </div>
          </FormField>
          <div className="col-span-1 gap-2 md:col-span-2 lg:col-span-6 flex justify-end">
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
              startIcon={column?.edit ? <Save /> : <Add />}
            >
              {column?.edit ? "Salvar" : "Adicionar coluna"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddColumn;
