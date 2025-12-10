import {
  Close,
  GroupAdd,
  GroupRemove,
  Groups,
  PersonOffOutlined,
} from "@mui/icons-material";
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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast } from "react-toastify";
import { useCompany } from "../../../../hooks/useCompany";
import api from "../../../../services/api";

const ModalHierarchy = ({
  isOpen,
  onClose,
  desHierarchy,
  setDesHierarchy,
  viewHierarchy,
  setViewHierarchy,
  setRefresh,
  responsibleHierarchy,
}) => {
  const [responsibleUser, setResponsibleUser] = useState(null);
  const [eligibleResponsibleUsers, setEligibleResponsibleUsers] = useState([]);
  const [associatedUsers, setAssociatedUsers] = useState([]);
  const [eligibleSubordinates, setEligibleSubordinates] = useState([]);
  const user = useAuthUser();
  const { company } = useCompany();

  const operationStyle = {
    view: {
      icon: <Groups />,
      title: "Visualizar equipe",
      description: "Visualize os membros da equipe e seus responsáveis.",
    },
    remove: {
      icon: <GroupRemove />,
      title: "Remover membro",
      description: "Remova um membro da equipe.",
    },
    add: {
      icon: <GroupAdd />,
      title: "Adicionar membro",
      description: "Vincule um membro à equipe.",
    },
  };

  const operation = viewHierarchy ? "view" : desHierarchy ? "remove" : "add";

  // fetchelegibleResposibleUsers
  const fetchEligibleResponsibleUsers = async () => {
    try {
      const response = await api.get(
        `/users/potential-responsibles?companyId=${company?.id}`,
      );
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

      console.log("fetchEligibleSubordinates id:", id);
      const endpoint = desHierarchy
        ? `/users/my-subordinates?userId=${id}`
        : `/users/eligible-subordinates/${id}`;

      const response = await api.get(endpoint);

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
      const response = await api.get(
        `/users/my-subordinates?userId=${responsibleHierarchy?.id}`,
      );
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
            responsible_user_id: user.isLighthouse
              ? responsibleUser?.id
              : user?.id,
            target_user_ids: targetUserIds,
          }
        : {
            responsible_user_id: user.isLighthouse
              ? responsibleUser?.id
              : user?.id,
            target_user_ids: targetUserIds,
          };

      const endpoint = desHierarchy
        ? "/users/unassign-responsible"
        : "/users/assign-responsible";

      await api.post(endpoint, payload);

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
            toast.error(err);
          });

          toast.error(apiErrors);
        } else if (apiMessage) {
          toast.error(apiMessage);
        } else {
          toast.error("Erro ao processar a solicitação. Tente novamente.");
        }

        if (error?.message) {
          toast.error(apiMessage);
        }
      } else {
        toast.error("Erro ao conectar ao servidor. Tente novamente.");
      }
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
    onClose();
    setTimeout(() => {
      setEligibleSubordinates([]);
      setResponsibleUser(null);
      setAssociatedUsers([]);
      setDesHierarchy(false);
      setViewHierarchy(false);
    }, 100);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>
        <div className="flex flex-row gap-2">
          {operationStyle[operation].icon}
          <h2>{operationStyle[operation].title}</h2>
        </div>
        <p className="text-sm text-neutral-500">
          {operationStyle[operation].description}
        </p>
      </DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        {viewHierarchy ? (
          <Box>
            {associatedUsers.length === 0 ? (
              <div className="flex flex-col gap-2 py-4 items-center justify-center border-2 border-neutral-700 rounded-md border-dashed">
                <PersonOffOutlined fontSize="large" color="disabled" />
                <p className="text-sm text-neutral-400">
                  Não há usuários na sua equipe.
                </p>
              </div>
            ) : (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Responsável pela Equipe
                </Typography>
                <Chip
                  key={responsibleHierarchy?.id}
                  label={responsibleHierarchy?.name}
                  color="primary"
                  style={{ margin: "4px" }}
                />
              </>
            )}

            {/* Se houver membros */}
            {associatedUsers.some((user) => user.role !== "leader") && (
              <>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ marginTop: 2 }}
                >
                  Membros da Equipe
                </Typography>
                {associatedUsers
                  .filter((user) => user.role !== "leader")
                  .map((user) => (
                    <Chip
                      key={user.id}
                      label={user.name}
                      style={{ margin: "4px" }}
                    />
                  ))}
              </>
            )}
          </Box>
        ) : (
          <>
            {
              <Box>
                <InputLabel>Selecione o usuário responsável</InputLabel>
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
                      placeholder={"Selecione um usuário responsável da equipe"}
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
