import { Edit, LockOpen, Save } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../../components/FormField";
import PageTitle from "../../components/PageTitle";
import PermissionCategory from "../../components/PermissionCategory";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";

const RoleView = () => {
  const { id } = useParams();
  const methods = useForm();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(location.state?.edit || false);
  const { isLighthouse } = useUserState().state;
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data: role } = useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const response = await api.get(`/roles/${id}`);
      const role = response.data.data;
      methods.setValue("name", role.name);
      methods.setValue("nivel", role.nivel);
      methods.setValue("company.name", role.company.name);
      setSelectedPermissions(role.permissions);
      return response.data.data;
    },
  });

  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await api.get("/permissions");
      const formatted = {};

      response.data.data.map((permission) => {
        formatted[permission.category] = formatted[permission.category] || [];
        formatted[permission.category].push(permission);
      });

      return formatted;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(`/roles/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cargo atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar o cargo", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Erro ao atualizar o cargo");
    },
    onSettled: () => {
      setIsEditing(false);
    },
  });

  const onSubmit = (data) => {
    if (Object.keys(methods.formState.errors).length > 0) {
      console.error("errors", methods.formState.errors);
      return toast.error("Preencha todos os campos corretamente");
    }

    console.log("data", {
      ...data,
      permissions: selectedPermissions.map((permission) => permission.id),
    });

    mutate({
      ...data,
      permissions: selectedPermissions.map((permission) => permission.id),
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-8">
        <PageTitle
          title="Cargo"
          icon={<LockOpen />}
          buttons={
            isEditing
              ? [
                  <Button
                    key="save-role-form"
                    loading={isPending}
                    type="submit"
                    form="role-form"
                    variant="contained"
                    startIcon={<Save fontSize="small" />}
                  >
                    SALVAR
                  </Button>,
                ]
              : [
                  <Button
                    key="edit-role-form"
                    loading={isPending}
                    variant="contained"
                    type="button"
                    onClick={() => setIsEditing(true)}
                    startIcon={<Edit fontSize="small" />}
                  >
                    EDITAR
                  </Button>,
                ]
          }
        />
        <form
          className="grid grid-cols-1 lg:grid-cols-6 gap-8 w-full"
          id="role-form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <FormField
            label="Nome"
            containerClass={`${isLighthouse ? "lg:col-span-3" : "lg:col-span-5"}`}
          >
            <TextField
              fullWidth
              name="name"
              {...methods.register("name")}
              slotProps={{
                input: {
                  readOnly: !isEditing,
                },
              }}
            />
          </FormField>
          <FormField label="Nível" containerClass="col-span-1">
            <TextField
              fullWidth
              name="level"
              {...methods.register("nivel")}
              slotProps={{
                input: {
                  readOnly: !isEditing,
                },
              }}
            />
          </FormField>
          {isLighthouse && (
            <FormField label="Empresa" containerClass="col-span-2">
              <TextField
                fullWidth
                name="company.name"
                {...methods.register("company.name")}
                slotProps={{
                  input: {
                    readOnly: !isEditing,
                  },
                }}
              />
            </FormField>
          )}
          <div className="col-span-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Permissões</h2>
            {permissions &&
              Object.keys(permissions).map((category) => (
                <PermissionCategory
                  isEditing={isEditing}
                  key={category}
                  category={category}
                  permissions={permissions[category]}
                  selectedPermissions={selectedPermissions}
                  setSelectedPermissions={setSelectedPermissions}
                />
              ))}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default RoleView;
