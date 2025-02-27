import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
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
          <b>Razão Social:</b> {selectedCompany?.name}
        </Box>
        <Box>
          <b>Nome Fantasia:</b> {selectedCompany?.dba}
        </Box>
        <Box>
          <b>CNPJ:</b> {selectedCompany?.cnpj}
        </Box>
        <Box>
          <b>CPF da Pessoa Responsável pela Empresa:</b> {selectedCompany?.responsible_cpf}
        </Box>

        <Typography sx={{ mt: 2 }}>
          <b>Endereço:</b>
        </Typography>
        <Box>
          <b>CEP:</b> {selectedCompany?.address?.postal_code}
        </Box>
        <Box>
          <b>Logradouro:</b> {selectedCompany?.address?.street}
        </Box>
        <Box>
          <b>Número:</b> {selectedCompany?.address?.number}
        </Box>
        <Box>
          <b>Complemento:</b> {selectedCompany?.address?.complement}
        </Box>
        <Box>
          <b>Bairro:</b> {selectedCompany?.address?.neighborhood}
        </Box>
        <Box>
          <b>Cidade:</b> {selectedCompany?.address?.city}
        </Box>
        <Box>
          <b>Estado:</b> {selectedCompany?.address?.state}
        </Box>
        <Box>
          <b>País:</b> {selectedCompany?.address?.country}
        </Box>
        <Typography sx={{ mt: 2 }}>
          <b>Roles:</b>
        </Typography>
        <Box>
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
