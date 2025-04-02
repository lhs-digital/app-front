import { EditNote, Save } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Tab } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../components/PageTitle";
import api from "../../services/api";
import { formatClient } from "../../services/clientFormatter";
import {
  address,
  complimentary,
  contact,
  contract,
  general,
  sale,
} from "./defaults";
import Address from "./tabs/Address";
import Complementary from "./tabs/Complementary";
import Contact from "./tabs/Contact";
import Crm from "./tabs/Crm";
import Documentation from "./tabs/Documentation";
import General from "./tabs/General";

const ClientFormContext = createContext();

export const ClientFormProvider = ({ children }) => {
  const { id } = useParams();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(location.state?.edit || false);
  const errorColumns = location.state?.columns;
  const isCreating = id === "novo";
  const [auditErrors, setAuditErrors] = useState(
    errorColumns
      ? errorColumns?.reduce((acc, column) => {
          acc[column.name] = {
            message: column.message,
          };
          return acc;
        }, {})
      : {},
  );

  const resetAuditErrors = () => {
    setAuditErrors({});
  };

  const { data: client } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    },
    enabled: !isCreating,
  });

  return (
    <ClientFormContext.Provider
      value={{
        isEditing,
        isCreating,
        setIsEditing,
        auditErrors,
        resetAuditErrors,
        client,
        id,
      }}
    >
      {children}
    </ClientFormContext.Provider>
  );
};

export const useClientForm = () => {
  const context = useContext(ClientFormContext);
  if (context === undefined) {
    throw new Error("useClientForm must be used within a ClientFormProvider");
  }
  return context;
};

const ClientForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const { isEditing, setIsEditing, isCreating, client, id, resetAuditErrors } =
    useClientForm();

  const methods = useForm({
    defaultValues: {
      ...general,
      ...contact,
      ...complimentary,
      ...address,
      ...sale,
      ...contract,
    },
  });

  const { mutate: createClient, isPending: createIsPending } = useMutation({
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

  const { mutate: updateClient, isPending: updateIsPending } = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(`/clients/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cliente atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar o cliente", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Erro ao atualizar o cliente");
    },
    onSettled: () => {
      setIsEditing(false);
      resetAuditErrors();
    },
  });

  useEffect(() => {
    if (!client) return;
    Object.keys(client).forEach((key) => {
      methods.setValue(key, client[key]);
    });
  }, [client]);

  const onSubmit = (data) => {
    if (Object.keys(methods.formState.errors).length > 0) {
      console.error("errors", methods.formState.errors);
      return toast.error("Preencha todos os campos corretamente");
    }

    if (isCreating) return createClient(formatClient(data));

    return updateClient(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <PageTitle
          title={
            isEditing
              ? "Edição de cliente"
              : isCreating
                ? "Novo cliente"
                : "Visualização de cliente"
          }
          icon={<EditNote />}
          buttons={
            isEditing || isCreating
              ? [
                  <Button
                    key="create-client-button"
                    type="submit"
                    loading={updateIsPending || createIsPending}
                    variant="contained"
                    startIcon={<Save />}
                  >
                    SALVAR
                  </Button>,
                ]
              : [
                  <Button
                    key="edit-client-button"
                    type="button"
                    variant="contained"
                    color="primary"
                    startIcon={<EditNote />}
                    onClick={() => setIsEditing(true)}
                  >
                    EDITAR
                  </Button>,
                ]
          }
        />
        <TabContext value={activeTab}>
          <TabList
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            aria-label="Formulário de clientes"
          >
            <Tab label="Informações gerais" value={1} />
            <Tab label="Endereço" value={2} />
            <Tab label="Contato" value={3} />
            <Tab label="CRM" value={4} />
            <Tab label="Complementar" value={5} />
            {/* <Tab label="Contrato" value={6} /> */}
            <Tab label="Documentação" value={7} />
          </TabList>
          <TabPanel value={1} sx={{ padding: 0 }}>
            <General data={client} />
          </TabPanel>
          <TabPanel value={2} sx={{ padding: 0 }}>
            <Address data={client} />
          </TabPanel>
          <TabPanel value={3} sx={{ padding: 0 }}>
            <Contact />
          </TabPanel>
          <TabPanel value={4} sx={{ padding: 0 }}>
            <Crm />
          </TabPanel>
          <TabPanel value={5} sx={{ padding: 0 }}>
            <Complementary />
          </TabPanel>
          {/* <TabPanel value={6} sx={{ padding: 0 }}>
            <Contract />
          </TabPanel> */}
          <TabPanel value={7} sx={{ padding: 0 }}>
            <Documentation />
          </TabPanel>
        </TabContext>
      </form>
    </FormProvider>
  );
};

const ClientView = () => {
  return (
    <ClientFormProvider>
      <ClientForm />
    </ClientFormProvider>
  );
};

export default ClientView;
