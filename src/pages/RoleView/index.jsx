import { Edit, LockOpen, Save } from "@mui/icons-material";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../../components/FormField";
import PageTitle from "../../components/PageTitle";
import PermissionCategory from "../../components/PermissionCategory";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";

const RoleView = () => {
  const { id } = useParams();
  const isCreating = id === "novo";
  const methods = useForm();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(location.state?.edit || false);
  const navigate = useNavigate();
  const { isLighthouse } = useUserState().state;
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data: companies, isFetched: isCompanyFetched } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await api.get("/companies");
      return response.data.data;
    },
  });

  const { data: role } = useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const response = await api.get(`/roles/${id}`);
      return response.data.data;
    },
    enabled: !isCreating && isCompanyFetched,
  });

  useEffect(() => {
    if (!role) return;
    console.log("role", role);
    methods.setValue("name", role.name);
    methods.setValue("nivel", role.nivel);
    methods.setValue("company", role.company);
    setSelectedPermissions(role.permissions);
  }, [role]);

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

  const { mutate: createRole, isPending: createIsPending } = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/roles", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cargo criado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao criar o cargo", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
      return toast.error("Erro ao criar o cargo");
    },
    onSettled: (data) => {
      navigate(`/papeis/${data.data.id}`);
    },
  });

  const { mutate: updateRole, isPending: updateIsPending } = useMutation({
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

    if (isCreating)
      return createRole({
        ...data,
        company_id: data.company.id,
      });

    return updateRole({
      ...data,
      company_id: data.company.id,
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
            isEditing || isCreating
              ? [
                  <Button
                    key="save-role-form"
                    loading={updateIsPending || createIsPending}
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
                    loading={updateIsPending}
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
            required={isCreating}
            containerClass={`${isLighthouse ? "lg:col-span-3" : "lg:col-span-5"}`}
          >
            <TextField
              fullWidth
              name="name"
              {...methods.register("name", { required: "Campo obrigatório" })}
              slotProps={{
                input: {
                  readOnly: !isEditing && !isCreating,
                },
              }}
            />
          </FormField>
          <FormField
            label="Nível"
            containerClass="col-span-1"
            required={isCreating}
          >
            <TextField
              fullWidth
              name="level"
              type="number"
              {...methods.register("nivel", { required: "Campo obrigatório" })}
              slotProps={{
                input: {
                  readOnly: !isEditing && !isCreating,
                },
              }}
            />
          </FormField>
          {isLighthouse ? (
            isCreating || isEditing ? (
              <FormField
                label="Empresa"
                containerClass="col-span-2"
                required={isCreating}
              >
                <Controller
                  control={methods.control}
                  name="company"
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      className="col-span-8"
                      noOptionsText="Nenhuma empresa encontrada."
                      options={companies || []}
                      getOptionLabel={(option) => option.name}
                      getOptionKey={(option) => option.id}
                      loadingText="Carregando..."
                      readOnly={!isEditing && !isCreating}
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(e, newValue) => field.onChange(newValue)}
                    />
                  )}
                />
              </FormField>
            ) : (
              <FormField
                label="Empresa"
                containerClass="col-span-2"
                required={isCreating}
              >
                <TextField
                  fullWidth
                  name="company.name"
                  type="text"
                  {...methods.register("company.name", {
                    required: "Campo obrigatório",
                  })}
                  slotProps={{
                    input: {
                      readOnly: !isEditing && !isCreating,
                    },
                  }}
                />
              </FormField>
            )
          ) : null}
          <div className="col-span-full flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Permissões</h2>
            {permissions &&
              Object.keys(permissions).map((category) => (
                <PermissionCategory
                  readOnly={!isEditing && !isCreating}
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
