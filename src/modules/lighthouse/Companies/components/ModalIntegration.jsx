import { IntegrationInstructions, Save } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormField from "../../../../components/FormField/index";
import { useCompany } from "../../../../hooks/useCompany";
import api from "../../../../services/api";

const ModalIntegration = ({ isOpen, onClose, setRefresh }) => {
  const { availableCompanies, company } = useCompany();
  const qc = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: "",
      type: "db",
      baseUrl: "",
      apiToken: "",
      apiAuthType: "bearer",
      dbDriver: "mysql",
      dbHost: "",
      dbPort: "",
      dbName: "",
      dbUsername: "",
      dbPassword: "",
    },
  });

  const watchedCompany = watch("company");
  const watchedType = watch("type");

  const { data: integrationData } = useQuery({
    queryKey: ["integration", watchedCompany],
    queryFn: async () => {
      const response = await api.get(`/companies/${watchedCompany}/connection`);
      return response.data.data;
    },
    enabled: !!watchedCompany && isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        company: company?.id || "",
        type: "db",
        baseUrl: "",
        apiToken: "",
        apiAuthType: "bearer",
        dbDriver: "mysql",
        dbHost: "",
        dbPort: "",
        dbName: "",
        dbUsername: "",
        dbPassword: "",
      });
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (integrationData?.connection) {
      if (integrationData.type === "api") {
        setValue("type", "api");
        setValue("baseUrl", integrationData.connection.api_base_url || "");
        setValue("apiToken", integrationData.connection.api_token || "");
        setValue(
          "apiAuthType",
          integrationData.connection.api_auth_type || "bearer",
        );
      } else {
        setValue("type", "db");
        setValue("dbDriver", integrationData.connection.db_driver || "mysql");
        setValue("dbHost", integrationData.connection.db_host || "");
        setValue("dbPort", integrationData.connection.db_port || "");
        setValue("dbName", integrationData.connection.db_name || "");
        setValue("dbUsername", integrationData.connection.db_username || "");
        setValue("dbPassword", integrationData.connection.db_password || "");
      }
    }
  }, [integrationData, setValue]);

  const { mutate: testConnection, isPending: testConnectionPending } =
    useMutation({
      mutationFn: async (formData) => {
        const integrationData = {
          driver: formData.dbDriver,
          host: formData.dbHost,
          port: formData.dbPort,
          database: formData.dbName,
          username: formData.dbUsername,
          password: formData.dbPassword,
        };
        return api.post("/database/test-connection", integrationData);
      },
      onSuccess: (response) => {
        if (response.data.success) {
          toast.success("Teste de Conexão bem-sucedida!");
        } else {
          toast.error(response.data.message || "Falha ao testar conexão.");
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Erro ao testar conexão.");
      },
    });

  const { mutate: saveIntegration, isPending: saveIntegrationPending } =
    useMutation({
      mutationFn: async (formData) => {
        const integrationData =
          formData.type === "api"
            ? {
                type: "api",
                connection: {
                  api_base_url: formData.baseUrl,
                  api_token: formData.apiToken,
                  api_auth_type: formData.apiAuthType,
                },
              }
            : {
                type: "db",
                connection: {
                  db_driver: formData.dbDriver,
                  db_host: formData.dbHost,
                  db_port: formData.dbPort,
                  db_name: formData.dbName,
                  db_username: formData.dbUsername,
                  db_password: formData.dbPassword,
                },
              };

        return api.put(
          `/companies/${formData.company}/connection`,
          integrationData,
        );
      },
      onSuccess: () => {
        qc.invalidateQueries(["integration"]);
        setRefresh((prev) => !prev);
        toast.success("Integração configurada com sucesso!");
        reset();
        onClose();
      },
      onError: (error) => {
        toast.error(
          "Erro ao configurar a integração: " +
            (error.response?.data?.message || "Erro desconhecido"),
        );
        console.error("Erro ao configurar a integração.", error);
      },
    });

  const onSubmit = (formData) => {
    if (!formData.company) {
      toast.error("Por favor, selecione uma empresa.");
      return;
    }

    if (formData.type === "api") {
      if (!formData.baseUrl || !formData.apiToken) {
        toast.error(
          "Por favor, preencha todos os campos obrigatórios para a API.",
        );
        return;
      }
    } else {
      if (
        !formData.dbDriver ||
        !formData.dbHost ||
        !formData.dbPort ||
        !formData.dbName ||
        !formData.dbUsername ||
        !formData.dbPassword
      ) {
        toast.error(
          "Por favor, preencha todos os campos obrigatórios para o Banco de Dados.",
        );
        return;
      }
    }

    saveIntegration(formData);
  };

  const handleTestConnection = () => {
    const formData = getValues();
    const dbData = {
      dbDriver: formData.dbDriver,
      dbHost: formData.dbHost,
      dbPort: formData.dbPort,
      dbName: formData.dbName,
      dbUsername: formData.dbUsername,
      dbPassword: formData.dbPassword,
    };

    if (
      !dbData.dbDriver ||
      !dbData.dbHost ||
      !dbData.dbPort ||
      !dbData.dbName ||
      !dbData.dbUsername ||
      !dbData.dbPassword
    ) {
      toast.error(
        "Por favor, preencha todos os campos obrigatórios para o teste de conexão de Banco de Dados.",
      );
      return;
    }

    testConnection(dbData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configurar Integração</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <Controller
            name="company"
            control={control}
            rules={{ required: "Empresa é obrigatória" }}
            render={({ field }) => (
              <FormField
                label="Empresa"
                error={!!errors.company}
                containerClass="col-span-full md:col-span-3"
                required
              >
                <Select
                  {...field}
                  placeholder="Selecione uma opção"
                  fullWidth
                  error={!!errors.company}
                >
                  {availableCompanies.map((companyItem) => (
                    <MenuItem key={companyItem.id} value={companyItem.id}>
                      {companyItem.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormField>
            )}
          />

          <Controller
            name="type"
            control={control}
            rules={{ required: "Tipo de integração é obrigatório" }}
            render={({ field }) => (
              <FormField
                label="Tipo de Integração"
                error={!!errors.type}
                containerClass="col-span-full md:col-span-2"
                required
              >
                <Select {...field} fullWidth error={!!errors.type}>
                  <MenuItem value="api">API</MenuItem>
                  <MenuItem value="db">Banco de Dados</MenuItem>
                </Select>
              </FormField>
            )}
          />
          {watchedType === "api" ? (
            <>
              <Controller
                name="baseUrl"
                control={control}
                rules={{ required: "URL da API é obrigatória" }}
                render={({ field }) => (
                  <FormField
                    label="URL da API"
                    error={!!errors.baseUrl}
                    containerClass="col-span-full"
                    required
                  >
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="https://api.exemplo.com"
                      error={!!errors.baseUrl}
                      helperText={errors.baseUrl?.message}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="apiToken"
                control={control}
                rules={{ required: "Token de acesso é obrigatório" }}
                render={({ field }) => (
                  <FormField
                    label="Chave de Acesso"
                    error={!!errors.apiToken}
                    containerClass="col-span-full md:col-span-3"
                    required
                  >
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="Seu token de acesso"
                      error={!!errors.apiToken}
                      helperText={errors.apiToken?.message}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="apiAuthType"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Tipo de Autenticação"
                    containerClass="col-span-full md:col-span-2"
                  >
                    <Select {...field} fullWidth>
                      <MenuItem value="bearer">Bearer</MenuItem>
                      <MenuItem value="basic">Basic</MenuItem>
                    </Select>
                  </FormField>
                )}
              />
            </>
          ) : (
            <>
              <Controller
                name="dbDriver"
                control={control}
                rules={{ required: "Driver é obrigatório" }}
                render={({ field }) => (
                  <FormField
                    label="Driver"
                    error={!!errors.dbDriver}
                    containerClass="col-span-full md:col-span-2"
                    required
                  >
                    <Select {...field} fullWidth error={!!errors.dbDriver}>
                      <MenuItem value="mysql">MySQL</MenuItem>
                      <MenuItem value="postgres">PostgreSQL</MenuItem>
                      <MenuItem value="sqlite">SQLite</MenuItem>
                    </Select>
                  </FormField>
                )}
              />
              <Controller
                name="dbHost"
                control={control}
                rules={{ required: "Host é obrigatório" }}
                render={({ field }) => (
                  <FormField
                    label="Host"
                    error={!!errors.dbHost}
                    containerClass="col-span-full md:col-span-2"
                    required
                  >
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="localhost"
                      error={!!errors.dbHost}
                      helperText={errors.dbHost?.message}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="dbPort"
                control={control}
                rules={{ required: "Porta é obrigatória" }}
                render={({ field }) => (
                  <FormField
                    label="Porta"
                    error={!!errors.dbPort}
                    containerClass="col-span-full md:col-span-1"
                    required
                  >
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="3306"
                      error={!!errors.dbPort}
                      helperText={errors.dbPort?.message}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="dbName"
                control={control}
                rules={{ required: "Nome do banco de dados é obrigatório" }}
                render={({ field }) => (
                  <FormField
                    label="Nome do Banco de Dados"
                    error={!!errors.dbName}
                    containerClass="col-span-full"
                    required
                  >
                    <TextField
                      {...field}
                      fullWidth
                      error={!!errors.dbName}
                      helperText={errors.dbName?.message}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="dbUsername"
                control={control}
                rules={{ required: "Usuário é obrigatório" }}
                render={({ field }) => (
                  <FormField
                    label="Usuário"
                    error={!!errors.dbUsername}
                    containerClass="col-span-full md:col-span-3"
                    required
                  >
                    <TextField
                      {...field}
                      fullWidth
                      error={!!errors.dbUsername}
                      helperText={errors.dbUsername?.message}
                    />
                  </FormField>
                )}
              />
              <Controller
                name="dbPassword"
                control={control}
                rules={{ required: "Senha é obrigatória" }}
                render={({ field }) => (
                  <FormField
                    label="Senha"
                    error={!!errors.dbPassword}
                    containerClass="col-span-full md:col-span-2"
                    required
                  >
                    <TextField
                      {...field}
                      fullWidth
                      type="password"
                      error={!!errors.dbPassword}
                      helperText={errors.dbPassword?.message}
                    />
                  </FormField>
                )}
              />
            </>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            reset();
            onClose();
          }}
          color="error"
          disabled={saveIntegrationPending || testConnectionPending}
        >
          Cancelar
        </Button>
        {watchedType === "db" && (
          <Button
            color="primary"
            onClick={handleTestConnection}
            disabled={testConnectionPending || saveIntegrationPending}
            startIcon={<IntegrationInstructions />}
          >
            Testar Conexão
          </Button>
        )}
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={saveIntegrationPending || testConnectionPending}
          loading={saveIntegrationPending}
          startIcon={<Save fontSize="small" />}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalIntegration;
