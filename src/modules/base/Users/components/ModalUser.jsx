import { Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCompany } from "../../../../hooks/useCompany";
import { useUserState } from "../../../../hooks/useUserState";
import api from "../../../../services/api";

const ModalUser = ({ selectedUser, mode, isOpen, onClose, data = [] }) => {
  const user = useAuthUser();
  const { state: userState } = useUserState();
  const { company, availableCompanies } = useCompany();
  const qc = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "",
      company: "",
    },
  });

  const watchedCompany = watch("company");

  const companyIdForRoles =
    mode === "create"
      ? watchedCompany || company?.id
      : userState?.isLighthouse
        ? watchedCompany || selectedUser?.company?.id
        : user.company?.id || selectedUser?.company?.id;

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["roles", companyIdForRoles],
    queryFn: async () => {
      const response = await api.get(`/roles/roles_from_company`, {
        params: { company_id: companyIdForRoles },
      });
      return response.data.data;
    },
    enabled: !!companyIdForRoles && isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "create") {
        reset({
          name: "",
          email: "",
          role: "",
          company: company?.id || "",
        });
      } else if (selectedUser) {
        reset({
          name: selectedUser?.name || "",
          email: selectedUser?.email || "",
          role: selectedUser?.role?.id || "",
          company: selectedUser?.company?.id || "",
        });
      }
    }
  }, [isOpen, selectedUser, mode, company, reset]);

  useEffect(() => {
    if (mode === "create" && company?.id && !userState?.isLighthouse) {
      setValue("company", company.id);
    }
  }, [mode, company, userState?.isLighthouse, setValue]);

  const { mutate: createUser, isPending: createUserPending } = useMutation({
    mutationFn: async (formData) => {
      return api.post("/users", {
        name: formData.name,
        email: formData.email,
        role_id: formData.role,
        company_id: formData.company || company?.id,
        password: "123456",
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(["users"]);
      toast.success("Usuário cadastrado com sucesso!");
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(
        "Erro ao cadastrar usuário: " +
          (error.response?.data?.message || "Erro desconhecido"),
      );
      console.error("Erro ao salvar usuário", error);
    },
  });

  const { mutate: updateUser, isPending: updateUserPending } = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        name: formData.name,
        email: formData.email,
        role_id: formData.role,
      };

      if (userState?.isLighthouse) {
        payload.company_id = formData.company;
      }

      return api.put(`/users/${selectedUser.id}`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries(["users"]);
      toast.success("Usuário editado com sucesso!");
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao salvar usuário", error);
      toast.error(
        "Erro ao editar usuário: " +
          (error.response?.data?.message || "Erro desconhecido"),
      );
    },
  });

  const onSubmit = (formData) => {
    if (mode === "create") {
      createUser(formData);
    } else {
      updateUser(formData);
    }
  };

  const emailAlreadyExists = (email) => {
    if (mode === "create" && data?.length) {
      return data.some((item) => item.email === email);
    }
    return false;
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Cadastrar Usuário";
      case "edit":
        return `Editar Usuário: ${selectedUser?.name || ""}`;
      case "view":
        return `Visualizar Usuário: ${selectedUser?.name || ""}`;
      default:
        return "Usuário";
    }
  };

  const canEditCompany =
    mode === "create" && userState?.isLighthouse
      ? true
      : mode === "edit" && userState?.isLighthouse
        ? true
        : false;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Box>
            <InputLabel>Nome *</InputLabel>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Nome é obrigatório" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  disabled={mode === "view"}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Box>
          <Box>
            <InputLabel>E-mail *</InputLabel>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "E-mail é obrigatório",
                validate: (value) => {
                  if (mode === "create" && emailAlreadyExists(value)) {
                    return "E-mail já cadastrado!";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  fullWidth
                  disabled={mode !== "create"}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Box>
          {canEditCompany ? (
            <Box>
              <InputLabel>Empresa *</InputLabel>
              <Controller
                name="company"
                control={control}
                rules={{ required: "Empresa é obrigatória" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Selecione uma opção"
                    fullWidth
                    disabled={mode === "view"}
                    error={!!errors.company}
                  >
                    {availableCompanies.map((companyItem) => (
                      <MenuItem key={companyItem.id} value={companyItem.id}>
                        {companyItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.company && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.company.message}
                </span>
              )}
            </Box>
          ) : (
            <Box>
              <InputLabel>Empresa *</InputLabel>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Select {...field} disabled fullWidth>
                    {company && (
                      <MenuItem value={company.id}>{company.name}</MenuItem>
                    )}
                    {selectedUser?.company && !company && (
                      <MenuItem value={selectedUser.company.id}>
                        {selectedUser.company.name}
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
            </Box>
          )}
          <Box>
            <InputLabel>Role *</InputLabel>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Role é obrigatória" }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Selecione uma opção"
                  fullWidth
                  disabled={mode === "view" || !companyIdForRoles || isLoading}
                  error={!!errors.role}
                >
                  {roles.map((roleItem) => (
                    <MenuItem key={roleItem.id} value={roleItem.id}>
                      {roleItem.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.role && (
              <span className="text-red-500 text-xs mt-1">
                {errors.role.message}
              </span>
            )}
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color={mode === "create" ? "error" : "default"}
          disabled={createUserPending || updateUserPending}
        >
          {mode === "view" ? "Fechar" : "Cancelar"}
        </Button>
        {mode !== "view" && (
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={createUserPending || updateUserPending}
            loading={createUserPending || updateUserPending}
            startIcon={<Save fontSize="small" />}
          >
            {mode === "create" ? "Cadastrar" : "Salvar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalUser;
