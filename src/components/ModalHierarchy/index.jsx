import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Chip,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import api from "../../services/api";
import { toast } from "react-toastify";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const ModalHierarchy = ({ isOpen, onClose, selectedUser, desHierarchy, setDesHierarchy }) => {
  const [responsibleUser, setResponsibleUser] = useState(null);
  const [associatedUsers, setAssociatedUsers] = useState([]);
  const [eligibleSubordinates, setEligibleSubordinates] = useState([]);
  const user = useAuthUser();

  const fetchEligibleSubordinates = async () => {
    try {
      const id = responsibleUser?.id || user.id;
      const response = await api.get(`/users/eligible-subordinates/${id}`);
      const formattedSubordinates = response.data?.flatMap((role) =>
        role.users.map((user) => ({
          id: user.id,
          name: user.name,
        }))
      );
      setEligibleSubordinates(formattedSubordinates || []);
    } catch (error) {
      toast.error("Erro ao buscar subordinados elegíveis.");
      console.error("Erro ao buscar subordinados elegíveis:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEligibleSubordinates();
    }
  }, [isOpen, responsibleUser]);

  const handleSave = async () => {
    try {
      const targetUserIds = associatedUsers.map((user) => user.id);

      const payload = desHierarchy
        ? { target_user_ids: targetUserIds }
        : {
          responsible_user_id: user?.id,
          target_user_ids: targetUserIds,
        };

      const endpoint = desHierarchy
        ? "/users/unassign-responsible"
        : "/users/assign-responsible";

      console.log("Payload enviado:", payload);

      const response = await api.post(endpoint, payload);

      const successMessage = desHierarchy
        ? "Usuários desvinculados com sucesso!"
        : "Responsável atribuído com sucesso!";
      toast.success(successMessage);
      console.log("Response:", response.data);

      handleClose();
    } catch (error) {
      // Verifica se há erros na resposta da API
      if (error.response) {
        const apiErrors = error.response.data.errors;
        const apiMessage = error.response.data.message;

        if (apiErrors) {
          Object.values(apiErrors).forEach((err) => {
            toast.error(err);
          });
        } else if (apiMessage) {
          toast.error(apiMessage);
        } else {
          toast.error("Erro ao processar a solicitação. Tente novamente.");
        }
      } else {
        toast.error("Erro ao conectar ao servidor. Tente novamente.");
      }

      console.error("Erro:", error);
    }
  };

  const handleAddUser = (user) => {
    if (user && !associatedUsers.some((u) => u.id === user.id)) {
      setAssociatedUsers((prev) => [...prev, user]);
    }
  };

  const handleRemoveUser = (user) => {
    setAssociatedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleClose = () => {
    setResponsibleUser(null);
    if (desHierarchy) {
      setTimeout(() => {
        setDesHierarchy(false);
      }, 1000);
    }
    setAssociatedUsers([]);
    setEligibleSubordinates([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{desHierarchy ? "Desvincular Usuários" : "Associar Usuários"}</DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        {selectedUser ? (
          <Box>
            <p>Você deseja se tornar responsável por este usuário?</p>
            <br />
            <p>Nome: {selectedUser?.name}</p>
            <p>Email: {selectedUser?.email}</p>
            <p>Cargo: {selectedUser?.role.name}</p>
          </Box>
        ) : (
          <>
            <Box>
              <InputLabel>Usuário Associado *</InputLabel>
              <Autocomplete
                options={eligibleSubordinates}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => handleAddUser(newValue)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Selecione um usuário para vincular" fullWidth />
                )}
              />
            </Box>
          </>
        )}
        <Box>
          {associatedUsers.map((user) => (
            <Chip
              key={user.id}
              label={user.name}
              onDelete={() => handleRemoveUser(user)}
              deleteIcon={<Close />}
              style={{ margin: "4px" }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={handleClose}>
          CANCELAR
        </Button>
        <Button color="primary" onClick={handleSave}>
          CONFIRMAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalHierarchy;