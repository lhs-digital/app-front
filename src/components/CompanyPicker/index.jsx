import { InfoOutlined, Save } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useCompany } from "../../hooks/useCompany";

const CompanyPicker = ({ open, onClose }) => {
  const { availableCompanies, setCompany } = useCompany();
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const onSelectClick = () => {
    if (!selectedCompany) {
      onClose(false);
    } else {
      setLoading(true);
      setCompany(selectedCompany);
      setSelectedCompany("");
      setTimeout(() => {
        setLoading(false);
        onClose(true);
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth scroll="body">
      <DialogTitle>Selecione a empresa</DialogTitle>
      <DialogContent className="flex flex-col gap-4">
        <p>Para acessar o sistema, escolha uma empresa.</p>
        <p className="text-neutral-500 text-sm text-justify">
          <span>
            <InfoOutlined fontSize="small" className="mr-2 mb-0.5" />
          </span>
          Você pode alternar entre as empresas a qualquer momento, clicando no
          nome da empresa no canto superior esquerdo.
        </p>
        <Divider />
        <FormControl>
          <InputLabel htmlFor="company">Empresa</InputLabel>
          <Select
            id="company"
            placeholder="Selecione uma opção"
            label="Empresa"
            value={selectedCompany}
            onChange={(e) => {
              setSelectedCompany(e.target.value);
            }}
            fullWidth
          >
            {availableCompanies.map((item) => (
              <MenuItem key={item.id} value={item}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Tooltip
          title={!selectedCompany ? "Selecione uma empresa para continuar" : ""}
          placement="top"
          arrow
        >
          <div>
            <Button
              color="primary"
              variant="contained"
              loading={loading}
              disabled={!selectedCompany}
              onClick={onSelectClick}
              endIcon={<Save />}
            >
              SELECIONAR
            </Button>
          </div>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyPicker;
