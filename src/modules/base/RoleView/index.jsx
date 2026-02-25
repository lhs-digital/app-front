import { Edit, LockOpen, Save } from "@mui/icons-material";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../../../components/FormField";
import { useCompany } from "../../../hooks/useCompany";
import { useUserState } from "../../../hooks/useUserState";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { roleLevelMap } from "../../../services/utils";
import PermissionCategory from "./components/PermissionCategory";

const RoleView = () => {
  const { id } = useParams();
  const isCreating = id === "novo";
  const methods = useForm();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(location.state?.edit || false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state: userState } = useUserState();
  const { company, availableCompanies } = useCompany();
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // const { data: companies, isFetched: isCompanyFetched } = useQuery({
  //   queryKey: ["companies", id],
  //   queryFn: async () => {
  //     const response = await api.get("/companies");
  //     return response.data.data;
  //   },
  // });

  const { data: role } = useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      const response = await api.get(`/roles/${id}`);
      return response.data.data;
    },
    enabled: !isCreating,
  });

  useEffect(() => {
    if (!role) return;
    methods.setValue("name", role.name);
    methods.setValue("nivel", parseInt(role.nivel));
    methods.setValue("company", role.company?.id || "");
    methods.setValue("company.name", role.company?.name || "");
    setSelectedPermissions(role.permissions);
  }, [role, methods]);

  useEffect(() => {
    if (isCreating && company?.id) {
      methods.setValue("company", company.id);
    }
  }, [isCreating, company, methods]);

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
    onSettled: () => {
      navigate(`/papeis`);
    },
  });

  const { mutate: updateRole, isPending: updateIsPending } = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(`/roles/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cargo atualizado com sucesso");
      // Invalidar a query para recarregar os dados atualizados
      queryClient.invalidateQueries({ queryKey: ["role", id] });
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

    console.log("data", data);

    const payload = {
      ...data,
      company_id: data.company || company?.id,
      permissions: selectedPermissions.map((permission) => permission.id),
    };

    // Remove company from payload if it's not needed in the API
    delete payload.company;

    console.log("payload", payload);

    if (isCreating) {
      return createRole(payload);
    }

    return updateRole(payload);
  };

  const canEditCompany =
    (isCreating && userState?.isLighthouse) ||
    (isEditing && userState?.isLighthouse);

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
          className="grid grid-cols-1 lg:grid-cols-6 gap-4 w-full"
          id="role-form"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <FormField
            label="Nome"
            required={isCreating}
            containerClass="lg:col-span-5"
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
            <Controller
              control={methods.control}
              name="nivel"
              render={({ field }) => (
                <Select
                  fullWidth
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  readOnly={!isEditing && !isCreating}
                >
                  {Object.entries(roleLevelMap).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormField>
          {canEditCompany ? (
            <FormField
              label="Empresa"
              containerClass="col-span-2"
              required={isCreating}
            >
              <Controller
                control={methods.control}
                name="company"
                rules={isCreating ? { required: "Campo obrigatório" } : {}}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={!isEditing && !isCreating}
                  >
                    {availableCompanies?.map((companyItem) => (
                      <MenuItem key={companyItem.id} value={companyItem.id}>
                        {companyItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormField>
          ) : (
            <FormField
              label="Empresa"
              containerClass="col-span-2"
              required={isCreating}
            >
              <Controller
                control={methods.control}
                name="company"
                render={({ field }) => (
                  <Select
                    {...field}
                    disabled
                    fullWidth
                    value={field.value || ""}
                  >
                    {company && (
                      <MenuItem value={company.id}>{company.name}</MenuItem>
                    )}
                    {role?.company && !company && (
                      <MenuItem value={role.company.id}>
                        {role.company.name}
                      </MenuItem>
                    )}
                  </Select>
                )}
              />
            </FormField>
          )}
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
