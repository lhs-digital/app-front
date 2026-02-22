import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  TextField,
} from "@mui/material";
import { useState } from "react";

const CompanySelect = ({
  open,
  onClose,
  companies,
  onSelect,
  currentCompany,
}) => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleClose = () => {
    setSelectedCompany();
    onClose();
  };

  const handleSelect = () => {
    onSelect(selectedCompany);
    handleClose();
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={handleClose}>
      <DialogTitle>Selecionar empresa</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <div className="flex flex-row gap-2 items-center mb-4 text-lg w-full border-b border-[--border] pb-2">
          <label
            htmlFor="currentCompany"
            className="flex flex-row gap-2 items-center"
          >
            <Radio checked={true} id="currentCompany" />
            {currentCompany?.name}
          </label>
        </div>
        <Autocomplete
          options={companies.filter(
            (company) => company.id !== currentCompany?.id,
          )}
          getOptionLabel={(option) => option.name}
          getOptionKey={(option) => option.id}
          renderInput={(params) => <TextField {...params} fullWidth />}
          value={selectedCompany}
          placeholder="Selecione uma empresa"
          onChange={(e, newValue) => setSelectedCompany(newValue)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSelect} color="primary" variant="contained">
          SELECIONAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanySelect;
