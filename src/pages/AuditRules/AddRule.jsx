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
import { severities, validations } from "../../services/utils";

const AddRule = ({ open = true, onClose = () => {} }) => {
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedValidation, setselectedValidation] = useState(null);
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

  const renderValidationField = () => {
    const validation = validations.find(
      (validation) => validation.name === selectedValidation,
    );
    if (!validation) return null;
    if (validation.field === "array")
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
    setselectedValidation(null);
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
              value={selectedValidation}
              onChange={(e) => {
                setselectedValidation(e.target.value);
              }}
            >
              {validations.map((validation) => (
                <MenuItem key={validation.name} value={validation.name}>
                  {validation.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex flex-row gap-4">
          {renderValidationField()}
          <FormControl className="grow">
            <FormLabel id="company-label">Prioridade</FormLabel>
            <Select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              {severities.map((severity) => (
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
              validations.find((c) => c.name === selectedValidation)
                ?.description
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
