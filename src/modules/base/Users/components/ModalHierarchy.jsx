import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast } from "react-toastify";
import api from "../../../../services/api";

const ModalHierarchy = ({
  isOpen,
  onClose,
  desHierarchy,
  setDesHierarchy,
  viewHierarchy,
  setViewHierarchy,
  setRefresh,
}) => {
  const [responsibleUser, setResponsibleUser] = useState(null);
  const [eligibleResponsibleUsers, setEligibleResponsibleUsers] = useState([]);
  const [associatedUsers, setAssociatedUsers] = useState([]);
  const [eligibleSubordinates, setEligibleSubordinates] = useState([]);
  const user = useAuthUser();

  // fetchelegibleResposibleUsers
  const fetchEligibleResponsibleUsers = async () => {
    try {
      const response = await api.get(`/users/potential-responsibles`);
      const formattedUsers = response.data?.flatMap((responsible) =>
        responsible.users.map((user) => ({
          id: user.id,
          name: user.name,
        })),
      );
      setEligibleResponsibleUsers(formattedUsers || []);
    } catch (error) {
      toast.error("Erro ao buscar usuários responsáveis elegíveis.");
      console.error("Erro ao buscar usuários responsáveis elegíveis:", error);
    }
  };

  const fetchEligibleSubordinates = async (responsibleId) => {
    try {
      const id = responsibleId || responsibleUser?.id || user?.id;

      const endpoint = desHierarchy
        ? `/users/my-subordinates?userId=${id}`
        : `/users/eligible-subordinates/${id}`;

      const response = await api.get(endpoint);

      console.log("response:", response)

      const formattedSubordinates = response.data?.flatMap((role) =>
        role.users.map((user) => ({
          id: user.id,
          name: user.name,
        })),
      );
      setEligibleSubordinates(formattedSubordinates || []);
    } catch (error) {
      toast.error("Erro ao buscar membros da equipe elegíveis.");
      console.error("Erro ao buscar membros da equipe elegíveis:", error);
    }
  };

  const fetchMySubordinates = async () => {
    try {
      const response = await api.get(`/users/my-subordinates`);
      const formattedSubordinates = response.data?.flatMap((role) =>
        role.users.map((user) => ({
          id: user.id,
          name: user.name,
        })),
      );
      if (desHierarchy) {
        setEligibleSubordinates(formattedSubordinates || []);
      } else {
        setAssociatedUsers(formattedSubordinates || []);
      }
    } catch (error) {
      toast.error("Erro ao buscar membros da equipe elegíveis.");
      console.error("Erro ao buscar membros da equipe elegíveis:", error);
    }
  };

  useEffect(() => {
    if (isOpen && (desHierarchy || viewHierarchy)) {
      fetchMySubordinates();
      fetchEligibleResponsibleUsers();
    } else if (isOpen) {
      fetchEligibleSubordinates();
      fetchEligibleResponsibleUsers();
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      const targetUserIds = associatedUsers.map((user) => user.id);
      const targetUserNames = associatedUsers
        .map((user) => user.name)
        .join(", ");

      const payload = desHierarchy
        ? {
          responsible_user_id: user.isLighthouse ? responsibleUser?.id : user?.id,
          target_user_ids: targetUserIds
        }
        : {
          responsible_user_id: user.isLighthouse ? responsibleUser?.id : user?.id,
          target_user_ids: targetUserIds,
        };

      const endpoint = desHierarchy
        ? "/users/unassign-responsible"
        : "/users/assign-responsible";

      const response = await api.post(endpoint, payload);

      const successMessage = desHierarchy
        ? `Usuários desvinculados com sucesso: ${targetUserNames}`
        : `Responsável atribuído com sucesso para: ${targetUserNames}`;
      toast.success(successMessage);

      setRefresh((prev) => !prev);

      handleClose();
    } catch (error) {
      if (error?.response) {
        const apiErrors = error.response.data.errors;
        const apiMessage = error.response.data.message;

        if (apiErrors) {
          Object.values(apiErrors).forEach((err) => {
            console.log("Toast erro (apiErrors):", err);
            toast.error(err);
          });

          toast.error(apiErrors)
        } else if (apiMessage) {
          console.log("Toast erro (apiMessage):", apiMessage);
          toast.error(apiMessage);
        } else {
          console.log("Toast erro (default)");
          toast.error("Erro ao processar a solicitação. Tente novamente.");
        }

        if (error?.message) {
          console.log("Toast erro (message):", error.message);
          toast.error(apiMessage);
        }
      } else {
        toast.error("Erro ao conectar ao servidor. Tente novamente.");
      }

      // console.error("Errdo:", error);
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
    setDesHierarchy(false);
    setViewHierarchy(false);
    setAssociatedUsers([]);
    setDesHierarchy(false);
    setViewHierarchy(false);
    setEligibleSubordinates([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        {viewHierarchy
          ? "Membros da sua equipe"
          : desHierarchy
            ? "Remover membros de uma equipe"
            : "Vincular membros em uma equipe"}
      </DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        {viewHierarchy ? (
          <Box>
            {associatedUsers.length === 0 ? (
              <span>Não há usuários na sua equipe.</span>
            ) : (
              associatedUsers.map((user) => (
                <Chip key={user.id} label={user.name} style={{ margin: "4px" }} />
              ))
            )}
          </Box>
        ) : (
          <>
            {

              <Box>
                <InputLabel>
                  Selecione o usuário responsável
                </InputLabel>
                <Autocomplete
                  options={eligibleResponsibleUsers}
                  value={responsibleUser}
                  onChange={(event, newValue) => {
                    console.log("newValue", newValue);
                    setResponsibleUser(newValue);
                    setAssociatedUsers([]);
                    if (newValue) {
                      fetchEligibleSubordinates(newValue.id);
                    } else {
                      setEligibleSubordinates([]);
                    }
                  }}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        "Selecione um usuário responsável da equipe"
                      }
                      fullWidth
                    />
                  )}
                />
              </Box>

            }
            <Box>
              <InputLabel>
                {desHierarchy
                  ? "Usuários para remover *"
                  : "Usuários para adicionar *"}
              </InputLabel>
              <Autocomplete
                options={eligibleSubordinates}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => handleAddUser(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      desHierarchy
                        ? "Selecione um usuário para remover da equipe"
                        : "Selecione um usuário para adicionar à equipe"
                    }
                    fullWidth
                  />
                )}
              />
            </Box>
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
          </>
        )}
      </DialogContent>
      <DialogActions>
        {viewHierarchy ? (
          <Button color="info" onClick={handleClose}>
            VOLTAR
          </Button>
        ) : (
          <>
            <Button color="info" onClick={handleClose}>
              CANCELAR
            </Button>
            <Button color="primary" onClick={handleSave}>
              CONFIRMAR
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalHierarchy;