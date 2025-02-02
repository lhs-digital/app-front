import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { dateFormatted } from "../../services/utils";

const ModalViewClient = ({ selectedUser, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Informações Gerais do Usuário</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <p>
            <b>Id:</b> {selectedUser?.id || "Não disponível"}
          </p>
          <p>
            <b>Número:</b> {selectedUser?.numero || "Não disponível"}
          </p>
          <p>
            <b>Email:</b> {selectedUser?.email || "Não disponível"}
          </p>
          <p>
            <b>Cnpj/Cpf:</b> {selectedUser?.cnpj_cpf || "Não disponível"}
          </p>
          <p>
            <b>Contribuinte Icms:</b>{" "}
            {selectedUser?.contribuinte_icms === "1" ? "Sim" : "Não"}
          </p>
          <p>
            <b>Data Nascimento:</b>{" "}
            {selectedUser?.data_nascimento || "Não disponível"}
          </p>
          <p>
            <b>Whatsapp:</b> {selectedUser?.whatsapp || "Não disponível"}
          </p>
          <p>
            <b>Referência:</b> {selectedUser?.referencia || "Não disponível"}
          </p>
          <p>
            <b>Tipo de Pessoa:</b>{" "}
            {selectedUser?.tipo_pessoa === "F" ? "Física" : "Jurídica"}
          </p>
          <p>
            <b>Criado em:</b>{" "}
            {dateFormatted(selectedUser?.created_at) || "Não disponível"}
          </p>
          <p>
            <b>Atualizado em:</b>{" "}
            {dateFormatted(selectedUser?.created_at) || "Não disponível"}
          </p>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalViewClient;
