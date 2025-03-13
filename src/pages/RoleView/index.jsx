import { Edit, LockOpen, Save } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../../components/FormField";
import PageTitle from "../../components/PageTitle";
import PermissionCategory from "../../components/PermissionCategory";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";

const RoleView = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const { isLighthouse } = useUserState().state;
  const { data: role } = useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const response = await api.get(`/roles/${id}`);
      console.log("role", response.data.data);

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

  useEffect(() => {
    if (role) {
      setValue("name", role.name);
      setValue("nivel", role.nivel);
      setValue("company.name", role.company.name);
    }
  }, [role]);

  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: role,
  });

  const onSubmit = (data) => {
    if (!isDirty) toast.info("Nenhuma alteração foi feita");
    if (errors) return toast.error("Preencha todos os campos corretamente");
    console.log("data", data);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Cargo"
        icon={<LockOpen />}
        buttons={
          isEditing
            ? [
                <Button
                  key="save-role-form"
                  type="submit"
                  form="role-form"
                  variant="contained"
                  startIcon={<Save />}
                >
                  SALVAR
                </Button>,
              ]
            : [
                <Button
                  key="edit-role-form"
                  variant="contained"
                  type="button"
                  onClick={() => setIsEditing(true)}
                  startIcon={<Edit />}
                >
                  EDITAR
                </Button>,
              ]
        }
      />
      <form
        className="grid grid-cols-1 lg:grid-cols-6 gap-8 w-full"
        id="role-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          label="Nome"
          containerClass={`${isLighthouse ? "lg:col-span-3" : "lg:col-span-5"}`}
        >
          <TextField
            fullWidth
            name="name"
            {...register("name")}
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
            {...register("nivel")}
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
              {...register("company.name")}
              slotProps={{
                input: {
                  readOnly: !isEditing,
                },
              }}
            />
          </FormField>
        )}
        <div className="col-span-full flex flex-col gap-4">
          {permissions &&
            Object.keys(permissions).map((category) => (
              <PermissionCategory
                key={category}
                category={category}
                permissions={permissions[category]}
                rolePermissions={role?.permissions}
              />
            ))}
        </div>
      </form>
    </div>
  );
};

export default RoleView;
