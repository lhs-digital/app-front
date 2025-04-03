import { Add, Close } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";

const AddRule = ({ open = true, onClose = () => {} }) => {
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [params, setParams] = useState([]);
  const [inputValue, setInputValue] = useState();

  const columns = [
    { id: 1, label: "Nome", name: "name" },
    { id: 2, label: "CPF/CNPJ", name: "cpf_cnpj" },
    { id: 3, label: "Coluna 3", name: "column_3" },
    { id: 4, label: "Coluna 4", name: "column_4" },
    { id: 5, label: "Coluna 5", name: "column_5" },
    { id: 6, label: "Coluna 6", name: "column_6" },
    { id: 7, label: "Coluna 7", name: "column_7" },
    { id: 8, label: "Coluna 8", name: "column_8" },
    { id: 9, label: "Coluna 9", name: "column_9" },
    { id: 10, label: "Coluna 10", name: "column_10" },
  ];

  const conditions = [
    {
      id: 1,
      name: "required",
      label: "É obrigatório(a)",
      has_params: 0,
      description: "Campo obrigatório",
      field: null,
    },
    {
      id: 2,
      name: "cpf_cnpj",
      label: "É um CPF ou CNPJ",
      has_params: 1,
      description:
        "Verifica se é um CPF ou CNPJ. Esta regra depende de valores como: F (pessoa física), J (Pessoa jurídica) e E (Estrangeiro). Selecione a coluna ou valor que contem esses valores.",
      field: null,
    },
    {
      id: 3,
      name: "is_of_legal_age",
      label: "É maior de idade",
      has_params: 0,
      description:
        "Verifica se a idade da pessoa é igual ou superior ao limite definido como maioridade",
      field: null,
    },
    {
      id: 4,
      name: "date",
      label: "É uma data",
      has_params: 0,
      description: "Verifica se é uma data válida",
      field: null,
    },
    {
      id: 5,
      name: "multi_email",
      label: "É um email",
      has_params: 0,
      description: "Verifica se é um email válido.",
      field: null,
    },
    {
      id: 6,
      name: "in",
      label: "Está em",
      has_params: 1,
      description: "Selecione os valores que serão aceitos por essa regra.",
      field: "array",
    },
    {
      id: 7,
      name: "not_in",
      label: "Não está em",
      has_params: 1,
      description: "Selecione os valores que não serão aceitos por essa regra.",
      field: "array",
    },
  ];

  const severities = [
    { label: "Baixa", name: "low", value: 0 },
    { label: "Média", name: "medium", value: 1 },
    { label: "Alta", name: "high", value: 2 },
  ];

  const renderConditionField = () => {
    const condition = conditions.find(
      (condition) => condition.name === selectedCondition,
    );
    if (!condition) return null;
    if (condition.field === "array")
      return (
        <FormControl className="w-full lg:w-3/4">
          <FormLabel id="company-label">Valores possíveis</FormLabel>
          <Autocomplete
            multiple
            id="tags-standard"
            options={[...params, inputValue && inputValue.trim()]}
            noOptionsText="Insira um valor"
            onChange={(event, value) => {
              setParams((prev) => [...prev, value]);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} placeholder="Insira um valor" />
            )}
          />
        </FormControl>
      );
  };

  const handleClose = () => {
    setSelectedColumn(null);
    setSelectedCondition(null);
    setSelectedSeverity(null);
    setParams([]);
    setInputValue("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar Regra</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <FormControl className="w-1/2">
            <FormLabel id="company-label">Coluna</FormLabel>
            <Select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              {columns?.map((column) => (
                <MenuItem key={column.id} value={column.name}>
                  {column.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className="w-1/2">
            <FormLabel id="company-label">Condição</FormLabel>
            <Select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
              }}
            >
              {conditions?.map((condition) => (
                <MenuItem key={condition.name} value={condition.name}>
                  {condition.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex flex-row gap-4">
          {renderConditionField()}
          <FormControl className="grow">
            <FormLabel id="company-label">Prioridade</FormLabel>
            <Select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              {severities?.map((severity) => (
                <MenuItem key={severity.name} value={severity.name}>
                  {severity.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <FormControl className="grow">
          <FormLabel id="company-label">Descrição</FormLabel>
          <TextField
            multiline
            rows={3}
            value={
              conditions.find((c) => c.name === selectedCondition)?.description
            }
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        </FormControl>
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
          onClick={() => {}}
          color="primary"
          startIcon={<Add />}
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRule;
