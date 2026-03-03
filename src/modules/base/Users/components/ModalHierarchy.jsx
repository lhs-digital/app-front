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
import { Controller, useForm } from "react-hook-form";
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
  responsibleHierarchy,
  onHierarchyUpdated,
}) => {
  const [eligibleResponsibleUsers, setEligibleResponsibleUsers] = useState([]);
  const [eligibleSubordinates, setEligibleSubordinates] = useState([]);
  const user = useAuthUser();
  const { company } = useCompany();

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      responsibleUser: null,
      associatedUsers: [],
    },
  });

  const responsibleUser = watch("responsibleUser");
  const associatedUsers = watch("associatedUsers");

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
        setValue("associatedUsers", formattedSubordinates || []);
      }
    } catch (error) {
      toast.error("Erro ao buscar membros da equipe elegíveis.");
      console.error("Erro ao buscar membros da equipe elegíveis:", error);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (!user?.isLighthouse) {
      setValue("responsibleUser", { id: user?.id, name: user?.name });
    }

    if (desHierarchy || viewHierarchy) {
      fetchMySubordinates();
      if (user?.isLighthouse) fetchEligibleResponsibleUsers();
    } else {
      fetchEligibleSubordinates();
      if (user?.isLighthouse) fetchEligibleResponsibleUsers();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    try {
      const targetUserIds = data.associatedUsers.map((user) => user.id);
      const targetUserNames = data.associatedUsers
        .map((user) => user.name)
        .join(", ");

      const payload = {
        responsible_user_id: user.isLighthouse
          ? data.responsibleUser?.id
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

      onHierarchyUpdated();

      handleClose();
    } catch (error) {
      console.error("ERRO:", {
        url: error?.config?.url,
        response: error?.response?.data,
        message: error?.message,
      });

      toast.error("ERRO DETECTADO — veja o console");
    }
  };

  const handleAddUser = (newUser) => {
    if (!newUser || associatedUsers.some((u) => u.id === newUser.id)) return;
    setValue("associatedUsers", [...associatedUsers, newUser]);
  };

  const handleRemoveUser = (targetUser) => {
    setValue(
      "associatedUsers",
      associatedUsers.filter((u) => u.id !== targetUser.id),
    );
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setEligibleSubordinates([]);
      reset();
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
        <p className="text-sm text-zinc-500">
          {operationStyle[operation].description}
        </p>
      </DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        {viewHierarchy ? (
          <Box>
            {associatedUsers.length === 0 ? (
              <div className="flex flex-col gap-2 py-4 items-center justify-center border-2 border-zinc-700 rounded-md border-dashed">
                <PersonOffOutlined fontSize="large" color="disabled" />
                <p className="text-sm text-zinc-400">
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
            {user?.isLighthouse && (
              <Box>
                <InputLabel>Selecione o usuário responsável</InputLabel>
                <Controller
                  name="responsibleUser"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={eligibleResponsibleUsers}
                      value={field.value}
                      onChange={(_, newValue) => {
                        field.onChange(newValue);
                        setValue("associatedUsers", []);
                        if (newValue) {
                          fetchEligibleSubordinates(newValue.id);
                        } else {
                          setEligibleSubordinates([]);
                        }
                      }}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Selecione um usuário responsável da equipe"
                          fullWidth
                        />
                      )}
                    />
                  )}
                />
              </Box>
            )}
            <Box>
              <InputLabel>
                {desHierarchy
                  ? "Usuários para remover *"
                  : "Usuários para adicionar *"}
              </InputLabel>
              <Autocomplete
                options={eligibleSubordinates.filter(
                  (opt) => !associatedUsers.some((u) => u.id === opt.id),
                )}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                disabled={
                  eligibleSubordinates.length > 0 &&
                  eligibleSubordinates.every((opt) =>
                    associatedUsers.some((u) => u.id === opt.id),
                  )
                }
                onChange={(_, newValue) => handleAddUser(newValue)}
                value={null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      eligibleSubordinates.length > 0 &&
                      eligibleSubordinates.every((opt) =>
                        associatedUsers.some((u) => u.id === opt.id),
                      )
                        ? "Todos os usuários já foram adicionados"
                        : desHierarchy
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
            <Button color="primary" onClick={handleSubmit(onSubmit)}>
              CONFIRMAR
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalHierarchy;
