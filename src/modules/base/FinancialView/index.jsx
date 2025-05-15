import { EditNote, Save } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, InputLabel, Tab, TextField } from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { qc } from "../../../services/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const FinancialAuditContext = createContext();

export const FinancialAuditProvider = ({ children }) => {
  const { id } = useParams();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(location.state?.edit || false);
  const isCreating = id === "novo";

  const { data: audit } = useQuery({
    queryKey: ["financialAudit", id],
    queryFn: async () => {
      const response = await api.get(`/module/financial_audit/${id}`);
      return response.data.data;
    },
    enabled: !isCreating,
  });

  return (
    <FinancialAuditContext.Provider
      value={{
        isEditing,
        isCreating,
        setIsEditing,
        audit,
        id,
      }}
    >
      {children}
    </FinancialAuditContext.Provider>
  );
};

export const useFinancialAudit = () => {
  const context = useContext(FinancialAuditContext);
  if (context === undefined) {
    throw new Error(
      "useFinancialAudit must be used within a FinancialAuditProvider"
    );
  }
  return context;
};

const FinancialAuditForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const { isEditing, setIsEditing, isCreating, audit, id } = useFinancialAudit();

  const methods = useForm({
    defaultValues: {
      cliente_contrato: {
        data_ativacao: audit?.cliente_contrato?.data_ativacao || "",
        data_base_financeiro: audit?.cliente_contrato?.data_base_financeiro || "",
        data_pago_ate: audit?.cliente_contrato?.data_pago_ate || "",
      },
      fn_areceber: {
        vencimento_boleto: audit?.fn_areceber?.vencimento_boleto || "",
      },
    },
  });

  const { mutate: createAudit, isPending: createIsPending } = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/module/financial_audit", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Auditoria criada com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao criar a auditoria", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Erro ao criar a auditoria");
    },
    onSettled: (data) => {
      navigate(`/auditoria-financeira/${data.data.id}`);
    },
  });

  const { mutate: updateAudit, isPending: updateIsPending } = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(`/module/financial_audit/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Auditoria atualizada com sucesso");
      qc.invalidateQueries(["financialAudit", id]);
    },
    onError: (error) => {
      console.error("Erro ao atualizar a auditoria", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Erro ao atualizar a auditoria");
    },
    onSettled: () => {
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (!audit) return;
    Object.keys(audit).forEach((key) => {
      methods.setValue(key, audit[key]);
    });
  }, [audit]);

  const onSubmit = (data) => {
    if (Object.keys(methods.formState.errors).length > 0) {
      console.error("errors", methods.formState.errors);
      return toast.error("Preencha todos os campos corretamente");
    }

    if (isCreating) return createAudit(data);

    return updateAudit(data);
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
              ? "Edição de Auditoria Financeira"
              : isCreating
              ? "Nova Auditoria Financeira"
              : "Visualização de Auditoria Financeira"
          }
          icon={<EditNote />}
          buttons={
            isEditing || isCreating
              ? [
                  <Button
                    key="save-audit-button"
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
                    key="edit-audit-button"
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
            aria-label="Formulário de Auditoria Financeira"
          >
            <Tab label="Dados Gerais" value={1} />
          </TabList>
          <TabPanel value={1} sx={{ padding: 0 }}>
            {/* Aba de Dados Gerais */}
            <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
              <Box className="lg:col-span-2">
                <InputLabel required>Data de Ativação</InputLabel>
                <TextField
                  type="date"
                  {...methods.register("cliente_contrato.data_ativacao", {
                    required: "Data de ativação é obrigatória",
                  })}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: !isEditing && !isCreating,
                    },
                    htmlInput: { max: new Date().toISOString().split("T")[0] },
                  }}
                />
              </Box>
              <Box className="lg:col-span-2">
                <InputLabel required>Data Base do Financeiro</InputLabel>
                <TextField
                  type="date"
                  {...methods.register("cliente_contrato.data_base_financeiro", {
                    required: "Data base do financeiro é obrigatória",
                    validate: (value) => {
                      const activationDate = methods.getValues(
                        "cliente_contrato.data_ativacao"
                      );
                      if (new Date(value) <= new Date(activationDate)) {
                        return "A Data Base do Financeiro deve ser posterior à Data de Ativação.";
                      }
                      return true;
                    },
                  })}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: !isEditing && !isCreating,
                    },
                    htmlInput: { max: new Date().toISOString().split("T")[0] },
                  }}
                  error={!!methods.formState.errors.cliente_contrato?.data_base_financeiro}
                  helperText={
                    methods.formState.errors.cliente_contrato?.data_base_financeiro
                      ?.message
                  }
                />
              </Box>
              <Box className="lg:col-span-2">
                <InputLabel required>Data do Pago Até</InputLabel>
                <TextField
                  type="date"
                  {...methods.register("cliente_contrato.data_pago_ate", {
                    required: "Data do pago até é obrigatória",
                  })}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: !isEditing && !isCreating,
                    },
                    htmlInput: { max: new Date().toISOString().split("T")[0] },
                  }}
                />
              </Box>
              <Box className="lg:col-span-2">
                <InputLabel required>Vencimento do Boleto</InputLabel>
                <TextField
                  type="date"
                  {...methods.register("fn_areceber.vencimento_boleto", {
                    required: "Vencimento do boleto número 1 é obrigatório",
                  })}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: !isEditing && !isCreating,
                    },
                    htmlInput: { max: new Date().toISOString().split("T")[0] },
                  }}
                />
              </Box>
            </div>
          </TabPanel>
          <Box className="lg:col-span-2" sx={{ marginTop: 2 }}>
              <p>Contagem de clientes que pagaram com antecedência no mês: </p>
              <p>Contagem de clientes q pagaram no vencimento: </p>
              <p>Contagem de clientes q pagaram com atraso, em um intervalo de 10 em 10 dias ate completar um ciclo de 30 dias: </p>
            </Box>
        </TabContext>
      </form>
    </FormProvider>
  );
};

const FinancialAuditView = () => {
  return (
    <FinancialAuditProvider>
      <FinancialAuditForm />
    </FinancialAuditProvider>
  );
};

export default FinancialAuditView;