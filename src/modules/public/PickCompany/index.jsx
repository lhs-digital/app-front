import { Save } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate } from "react-router-dom";
import LHBlack from "../../../assets/lh_black.svg";
import LHWhite from "../../../assets/lh_white.svg";
import { useThemeMode } from "../../../contexts/themeModeContext";
import { useCompany } from "../../../hooks/useCompany";
import { handleMode } from "../../../theme";

const PickCompany = () => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const { availableCompanies, setCompany } = useCompany();
  const [selectedCompany, setSelectedCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = handleMode(useThemeMode().mode);

  const onSelectClick = () => {
    setLoading(true);
    setCompany(selectedCompany);
    setSelectedCompany("");
    setTimeout(() => {
      setLoading(false);
    }, 750);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8 pb-10">
      <h1 className="text-2xl font-bold max-w-md">Opa, algo deu errado!</h1>
      <p className="text-justify max-w-md">
        Devido a algum erro, não há nenhuma empresa selecionada no momento.{" "}
      </p>
      <div className="flex flex-col gap-6 w-full max-w-md p-6 border border-black/10 dark:border-white/15 rounded-lg shadow-lg">
        <p>Selecione uma empresa no menu abaixo para continuar:</p>
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
        <div className="flex justify-end">
          <Tooltip
            title={
              !selectedCompany ? "Selecione uma empresa para continuar" : ""
            }
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
        </div>
      </div>
      <img
        src={theme === "dark" ? LHWhite : LHBlack}
        alt="Lighthouse"
        className="w-10 h-10 mb-1"
      />
    </div>
  );
};

export default PickCompany;
