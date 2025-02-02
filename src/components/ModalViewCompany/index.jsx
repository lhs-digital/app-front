import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";

const ModalViewCompany = ({ selectedCompany, isOpen, onClose }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseRole = await api.get(`/roles/roles_from_company`, {
          params: { company_id: selectedCompany.id },
        });
        setRoles(responseRole.data.data);
      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };
    getData();
  }, [setRoles, selectedCompany]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Informações Gerais da Empresa</DialogTitle>
      <DialogContent>
        <Box>
          <b>Nome:</b> {selectedCompany?.name}
        </Box>
        <Box>
          <b>CNPJ:</b> {selectedCompany?.cnpj}
        </Box>
        <Box>
          <b>Roles:</b>
          {
            roles.length === 0 ? (
              <Box>Nenhuma role foi encontrada</Box>
            ) : roles?.map((role) => (
                <Box key={role.id} ml="4">
                  {role.name}
                </Box>
              ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalViewCompany;
