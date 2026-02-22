import {
  ArrowBack,
  Autorenew,
  BusinessCenterOutlined,
  Cancel,
  Edit,
  InfoOutlined,
  LocationOnOutlined,
  OpenInNew,
  Save,
  SellOutlined,
  SettingsOutlined,
  Sync,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  TextField,
  Tooltip,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../../../../components/FormField";
import PageTitle from "../../../../layout/components/PageTitle";
import api from "../../../../services/api";
import ModalIntegration from "../components/ModalIntegration";

const CompanyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [modalIntegrationOpen, setModalIntegrationOpen] = useState(false);
  const {
    data: company,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const response = await api.get(`/companies/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["company_roles", id],
    queryFn: async () => {
      const response = await api.get(`/roles/roles_from_company`, {
        params: { company_id: id },
      });
      return response.data.data;
    },
    enabled: !!id,
  });

  const { data: connection } = useQuery({
    queryKey: ["company_connection", id],
    queryFn: async () => {
      const response = await api.get(`/companies/${id}/connection`);
      return response.data.data;
    },
    enabled: !!id,
  });

  const invalidateQueries = () => {
    qc.invalidateQueries(["company", id]);
    qc.invalidateQueries(["company_roles", id]);
    qc.invalidateQueries(["company_connection", id]);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      cnpj: "",
      dba: "",
      responsible_cpf: "",
      address: {
        postalCode: "",
        street: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "",
        complement: "",
        number: "",
      },
    },
  });

  const postalCode = watch("address.postalCode");

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || "",
        cnpj: company.cnpj || "",
        dba: company.dba || "",
        responsible_cpf: company.responsible_cpf || "",
        address: {
          postalCode: company.address?.postal_code || "",
          street: company.address?.street || "",
          neighborhood: company.address?.neighborhood || "",
          city: company.address?.city || "",
          state: company.address?.state || "",
          country: company.address?.country || "",
          complement: company.address?.complement || "",
          number: company.address?.number || "",
        },
      });
    }
  }, [company, reset]);

  // CEP lookup
  useEffect(() => {
    if (postalCode && postalCode.length === 8 && isEditing) {
      const fetchAddress = async () => {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${postalCode}/json/`,
          );
          const data = await response.json();

          if (data.erro) {
            toast.warning("CEP inválido!");
          } else {
            setValue("address.street", data.logradouro || "");
            setValue("address.neighborhood", data.bairro || "");
            setValue("address.city", data.localidade || "");
            setValue("address.state", data.uf || "");
            setValue("address.country", "Brasil");
          }
        } catch (error) {
          console.error("Erro ao buscar CEP", error);
        }
      };

      fetchAddress();
    }
  }, [postalCode, isEditing, setValue]);

  const validarCpf = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
  };

  const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, "");

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros[tamanho - i] * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos[0])) return false;

    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros[tamanho - i] * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos[1])) return false;

    return true;
  };

  const { mutate: syncData, isPending: syncDataPending } = useMutation({
    mutationFn: async () => {
      return api.post(`/companies/${id}/database/sync`);
    },
    onSuccess: () => {
      toast.success("Dados sincronizados com sucesso!");
      invalidateQueries();
    },
    onError: (error) => {
      console.error("Erro ao sincronizar dados", error);
      toast.error(error.response?.data?.message || "Erro ao sincronizar dados");
    },
  });

  const { mutate: updateCompany, isPending } = useMutation({
    mutationFn: async (data) => {
      return api.put(`/companies/${id}`, {
        name: data.name,
        cnpj: data.cnpj,
        dba: data.dba,
        responsible_cpf: data.responsible_cpf,
        address: {
          postal_code: data.address.postalCode,
          street: data.address.street,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
          country: data.address.country,
          complement: data.address.complement,
          number: data.address.number,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(["company", id]);
      qc.invalidateQueries(["companies"]);
      toast.success("Empresa alterada com sucesso!");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Erro ao alterar empresa", error);
      toast.error(error.response?.data?.message || "Erro ao alterar empresa");
    },
  });

  const onSubmit = (data) => {
    if (
      !data.name ||
      !data.cnpj ||
      !data.responsible_cpf ||
      !data.dba ||
      !data.address.postalCode ||
      !data.address.street ||
      !data.address.neighborhood ||
      !data.address.city ||
      !data.address.state ||
      !data.address.country ||
      !data.address.number
    ) {
      toast.warning(
        "Preencha os campos obrigatórios: Nome, CNPJ, Nome Fantasia, CPF do Responsável e Endereço!",
      );
      return;
    }

    if (!validarCNPJ(data.cnpj)) {
      toast.warning("CNPJ inválido!");
      return;
    }

    if (!validarCpf(data.responsible_cpf)) {
      toast.warning("CPF de Responsável da Empresa inválido!");
      return;
    }

    updateCompany(data);
  };

  const handleCancel = () => {
    if (company) {
      reset({
        name: company.name || "",
        cnpj: company.cnpj || "",
        dba: company.dba || "",
        responsible_cpf: company.responsible_cpf || "",
        address: {
          postalCode: company.address?.postal_code || "",
          street: company.address?.street || "",
          neighborhood: company.address?.neighborhood || "",
          city: company.address?.city || "",
          state: company.address?.state || "",
          country: company.address?.country || "",
          complement: company.address?.complement || "",
          number: company.address?.number || "",
        },
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full items-center justify-center min-h-[400px]">
        <CircularProgress />
        <p>Carregando informações da empresa...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col gap-6 w-full items-center justify-center min-h-[400px]">
        <p className="text-red-500">Erro ao carregar informações da empresa.</p>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/empresas")}
        >
          Voltar para Empresas
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageTitle
        title={company.name}
        icon={<BusinessCenterOutlined />}
        subtitle={
          isEditing
            ? "Edite as informações da empresa"
            : "Visualização detalhada das informações da empresa"
        }
        buttons={[
          <Button
            key="back-button"
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/empresas")}
          >
            Voltar
          </Button>,
          isEditing ? (
            <>
              <Button
                key="cancel-button"
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                key="save-button"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSubmit(onSubmit)}
                loading={isPending}
                disabled={isPending}
              >
                Salvar
              </Button>
            </>
          ) : (
            <Button
              key="edit-button"
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
          ),
        ]}
      />

      <form
        id="company-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-8 gap-8"
      >
        {/* Informações Gerais */}
        <h2 className="col-span-full font-medium flex items-center gap-2">
          <InfoOutlined className="mb-0.5" /> Informações Gerais
        </h2>

        <FormField
          label="Razão Social"
          required
          error={!!errors.name}
          containerClass="col-span-full md:col-span-4"
        >
          <TextField
            {...register("name", { required: true })}
            error={!!errors.name}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>

        <FormField
          label="Nome Fantasia"
          required
          error={!!errors.dba}
          containerClass="col-span-full md:col-span-4"
        >
          <TextField
            {...register("dba", { required: true })}
            error={!!errors.dba}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>
        <FormField
          label="CNPJ"
          required
          error={!!errors.cnpj}
          containerClass="col-span-full md:col-span-2"
        >
          <Controller
            name="cnpj"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <InputMask mask="99.999.999/9999-99" maskChar=" " {...field}>
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    error={!!errors.cnpj}
                    fullWidth
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                        maxLength: 18,
                      },
                    }}
                  />
                )}
              </InputMask>
            )}
          />
        </FormField>

        <FormField
          label="CPF do Responsável"
          required
          error={!!errors.responsible_cpf}
          containerClass="col-span-full md:col-span-2"
        >
          <Controller
            name="responsible_cpf"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <InputMask mask="999.999.999-99" maskChar=" " {...field}>
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    error={!!errors.responsible_cpf}
                    fullWidth
                    slotProps={{ input: { readOnly: !isEditing } }}
                  />
                )}
              </InputMask>
            )}
          />
        </FormField>

        <Divider className="col-span-full" />

        {/* Endereço */}
        <h2 className="col-span-full font-medium flex items-center gap-2">
          <LocationOnOutlined className="mb-0.5" /> Endereço
        </h2>

        <FormField
          label="CEP"
          required
          error={!!errors.address?.postalCode}
          containerClass="col-span-full md:col-span-1"
        >
          <TextField
            {...register("address.postalCode", { required: true })}
            error={!!errors.address?.postalCode}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
                maxLength: 8,
              },
            }}
          />
        </FormField>

        <FormField label="País" containerClass="col-span-full md:col-span-2">
          <TextField
            {...register("address.country")}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>

        <FormField
          label="Logradouro"
          containerClass="col-span-full md:col-span-3"
        >
          <TextField
            {...register("address.street")}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>

        <FormField label="Bairro" containerClass="col-span-full md:col-span-2">
          <TextField
            {...register("address.neighborhood")}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>

        <FormField label="Cidade" containerClass="col-span-full md:col-span-2">
          <TextField
            {...register("address.city")}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>

        <FormField label="Estado" containerClass="col-span-full md:col-span-1">
          <TextField
            {...register("address.state")}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>

        <FormField
          label="Número"
          required
          error={!!errors.address?.number}
          containerClass="col-span-full md:col-span-1"
        >
          <TextField
            {...register("address.number", { required: true })}
            error={!!errors.address?.number}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>

        <FormField
          label="Complemento"
          containerClass="col-span-full md:col-span-4"
        >
          <TextField
            {...register("address.complement")}
            fullWidth
            slotProps={{
              input: {
                readOnly: !isEditing,
              },
            }}
          />
        </FormField>

        <Divider className="col-span-full" />

        {/* Cargos - Read Only */}
        <div className="col-span-full flex justify-between w-full items-center">
          <h2 className="font-medium flex items-center gap-2">
            <SellOutlined className="mb-0.5" /> Cargos Cadastrados
          </h2>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => navigate(`/papeis?company_id=${company?.id}`)}
            endIcon={<OpenInNew />}
          >
            Ir para papéis e permissões
          </Button>
        </div>

        <FormField containerClass="col-span-full">
          {roles.length === 0 ? (
            <p className="text-zinc-500 text-sm">Nenhum cargo foi encontrado</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Chip
                  key={role.id}
                  label={role.name}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </div>
          )}
        </FormField>

        <Divider className="col-span-full" />

        {/* Configurações de Conexão - Read Only */}
        <div className="col-span-full flex justify-between w-full items-center">
          <h2 className="font-medium flex items-center gap-2">
            <Autorenew className="mb-0.5" /> Informações de Conexão
          </h2>
          <div className="flex gap-2">
            <Tooltip title={!connection ? "Nenhuma conexão configurada" : ""}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => syncData()}
                startIcon={<Sync />}
                loading={syncDataPending}
                disabled={syncDataPending || !connection || isEditing}
              >
                Sincronizar dados
              </Button>
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => setModalIntegrationOpen(true)}
              startIcon={<SettingsOutlined />}
              disabled={isEditing}
            >
              Configurar Integração
            </Button>
          </div>
        </div>

        {!connection ? (
          <FormField containerClass="col-span-full">
            <p className="text-zinc-500 text-sm">Nenhuma conexão configurada</p>
          </FormField>
        ) : connection?.type === "db" ? (
          <>
            <FormField
              label="Tipo de Integração"
              containerClass="col-span-full md:col-span-2"
            >
              <TextField
                value={
                  {
                    db: "Banco de Dados",
                    api: "API",
                  }[connection?.type] || "Não informado"
                }
                fullWidth
                disabled
              />
            </FormField>

            <FormField
              label="Driver"
              containerClass="col-span-full md:col-span-3"
            >
              <TextField
                value={
                  {
                    mysql: "MySQL",
                    postgresql: "PostgreSQL",
                    sqlite: "SQLite",
                  }[connection?.connection?.db_driver] || "Não informado"
                }
                fullWidth
                disabled
              />
            </FormField>

            <FormField
              label="Host"
              containerClass="col-span-full md:col-span-2"
            >
              <TextField
                value={connection?.connection?.db_host || "Não informado"}
                fullWidth
                disabled
              />
            </FormField>

            <FormField
              label="Porta"
              containerClass="col-span-full md:col-span-1"
            >
              <TextField
                value={connection?.connection?.db_port || "Não informado"}
                fullWidth
                disabled
              />
            </FormField>

            <FormField
              label="Nome do Banco de Dados"
              containerClass="col-span-full md:col-span-2"
            >
              <TextField
                value={connection?.connection?.db_name || "Não informado"}
                fullWidth
                disabled
              />
            </FormField>

            <FormField
              label="Usuário"
              containerClass="col-span-full md:col-span-2"
            >
              <TextField
                value={connection?.connection?.db_username || "Não informado"}
                fullWidth
                disabled
              />
            </FormField>
          </>
        ) : connection?.type === "api" ? (
          <>
            <FormField
              label="Tipo de Integração"
              containerClass="col-span-full md:col-span-2"
            >
              <TextField value="API" fullWidth disabled />
            </FormField>

            <FormField
              label="URL Base"
              containerClass="col-span-full md:col-span-3"
            >
              <TextField
                value={connection?.connection?.api_base_url || "Não informado"}
                fullWidth
                disabled
              />
            </FormField>

            <FormField
              label="Token de Autenticação"
              containerClass="col-span-full md:col-span-3"
            >
              <TextField
                value={
                  connection?.connection?.api_token
                    ? "Token configurado"
                    : "Não informado"
                }
                fullWidth
                disabled
              />
            </FormField>

            <FormField
              label="Tipo de Autenticação"
              containerClass="col-span-full md:col-span-2"
            >
              <TextField
                value={
                  {
                    basic: "Basic",
                    bearer: "Bearer",
                  }[connection?.connection?.api_auth_type] || "Não informado"
                }
                fullWidth
                disabled
              />
            </FormField>
          </>
        ) : (
          <FormField containerClass="col-span-full">
            <p className="text-zinc-500 text-sm">
              Tipo de conexão desconhecido
            </p>
          </FormField>
        )}
      </form>
      <ModalIntegration
        isOpen={modalIntegrationOpen}
        companyId={company?.id}
        onClose={() => {
          setModalIntegrationOpen(false);
          invalidateQueries();
        }}
      />
    </div>
  );
};

export default CompanyView;
