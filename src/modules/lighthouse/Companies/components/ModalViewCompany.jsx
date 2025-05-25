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
import { useCompany } from "../../../../hooks/useCompany";
import api from "../../../../services/api";

const ModalViewCompany = ({ isOpen, onClose }) => {
  const [roles, setRoles] = useState([]);
  const { company } = useCompany();

  useEffect(() => {
    const getData = async () => {
      try {
        const responseRole = await api.get(`/roles/roles_from_company`, {
          params: { company_id: company.id },
        });
        setRoles(responseRole.data.data);
      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };
    getData();
  }, [setRoles, company]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Informações Gerais da Empresa</DialogTitle>
      <DialogContent>
        <Box>
          <b>Razão Social:</b> {company?.name}
        </Box>
        <Box>
          <b>Nome Fantasia:</b> {company?.dba || "Não informado"}
        </Box>
        <Box>
          <b>CNPJ:</b> {company?.cnpj}
        </Box>
        <Box>
          <b>CPF da Pessoa Responsável pela Empresa:</b>{" "}
          {company?.responsible_cpf}
        </Box>

        <Typography sx={{ mt: 2 }}>
          <b>Endereço:</b>
        </Typography>
        <Box>
          <b>CEP:</b> {company?.address?.postal_code || "Não informado"}
        </Box>
        <Box>
          <b>Logradouro:</b> {company?.address?.street || "Não informado"}
        </Box>
        <Box>
          <b>Número:</b> {company?.address?.number || "Não informado"}
        </Box>
        <Box>
          <b>Complemento:</b> {company?.address?.complement || "Não informado"}
        </Box>
        <Box>
          <b>Bairro:</b> {company?.address?.neighborhood || "Não informado"}
        </Box>
        <Box>
          <b>Cidade:</b> {company?.address?.city || "Não informado"}
        </Box>
        <Box>
          <b>Estado:</b> {company?.address?.state || "Não informado"}
        </Box>
        <Box>
          <b>País:</b> {company?.address?.country || "Não informado"}
        </Box>
        <Typography sx={{ mt: 2 }}>
          <b>Roles:</b>
        </Typography>
        <Box>
          {roles.length === 0 ? (
            <Box>Nenhuma role foi encontrada</Box>
          ) : (
            roles?.map((role) => (
              <Box key={role.id} ml="4">
                {role.name}
              </Box>
            ))
          )}
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
