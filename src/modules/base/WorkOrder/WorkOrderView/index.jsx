import {
  ArrowBack,
  Cancel,
  Edit,
  RemoveCircleOutline,
  Save,
  UploadFile,
  UploadOutlined,
  WorkOutline,
} from "@mui/icons-material";
import { Button, Checkbox, CircularProgress, FormControlLabel, IconButton, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../../../layout/components/PageTitle";
import WorkOrderForm from "../../../../components/WorkOrderForm";
import api from "../../../../services/api";
import { assignmentsMock } from "../assignment_mock";
import FormField from "../../../../components/FormField";
import { statusInfo } from "../utils";
import { Controller } from "react-hook-form";

const WorkOrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const {
    data: assignment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assignment", id],
    queryFn: async () => {
      // Usando mock data por enquanto
      const found = assignmentsMock.find(
        (item) => String(item.id) === String(id)
      );
      if (!found) throw new Error("Ordem de serviço não encontrada");
      return found;
    },
  });

  const { mutate: saveAssignment, isPending: isSaving } = useMutation({
    mutationFn: async (data) => {
      return await api.put(`/assignments/${id}`, data);
    },
    onSuccess: () => {
      setIsEditing(false);
      setFormData(null);
      toast.success("Ordem de serviço atualizada com sucesso!");
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao salvar ordem de serviço", error);
      toast.error("Erro ao salvar a ordem de serviço");
    },
  });

  useEffect(() => {
    if (assignment && !formData) {
      setFormData(assignment);
    }
  }, [assignment, formData]);

  const handleSave = () => {
    if (formData) {
      saveAssignment(formData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <CircularProgress />
        <p>Carregando...</p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p>Ordem de serviço não encontrada.</p>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/ordens-de-servico")}
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageTitle
        title={`Ordem de Serviço #${String(assignment.id).padStart(4, "0")}`}
        icon={<WorkOutline />}
        subtitle={
          isEditing
            ? "Edição da Ordem de Serviço"
            : "Visualização da Ordem de Serviço"
        }
        buttons={[
          <Button
            key="back-button"
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/ordens-de-servico")}
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
                disabled={isSaving}
              >
                Cancelar
              </Button>

              <Button
                key="save-button"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? <CircularProgress size={20} /> : "Salvar"}
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
        id="os-form"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        <FormField
          required
          label="Status"
          info="Status da Ordem de Serviço."
          containerClass="col-span-full md:col-span-4"
        >
          <Select
            fullWidth
            value={formData?.status || ""}

            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          >
            {Object.entries(statusInfo).map(([key, status]) => (
              <MenuItem key={key} value={key}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormField>


        <FormField
          label="Quantidade de reaberturas"
          info="Número de vezes que a OS foi reaberta."
          containerClass="col-span-full md:col-span-2"
        >
          <TextField
            required
            type="text"
            fullWidth
            value={formData?.reopening_count || 0}
            disabled
          />
        </FormField>

        <FormField
          label="Prazo de Conclusão"
          info="Prazo para conclusão da Ordem de Serviço."
          containerClass="col-span-full md:col-span-3"
        >
          <TextField
            required
            type="text"
            fullWidth
            value={new Date(formData?.deadline).toLocaleString() || ""}
            disabled
          />
        </FormField>

        <FormField
          label="Erro Persistente"
          info="Indica se a OS é referente a um erro persistente."
          containerClass="col-span-full md:col-span-2"

        >
          <RadioGroup
            row
            value={formData?.is_persistent_error ? "yes" : "no"}
            onChange={(e) =>
              setFormData({
                ...formData,
                is_persistent_error: e.target.value === "yes",
              })
            }

          >
            <FormControlLabel disabled value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel disabled value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormField>


        <FormField
          required
          label="Descrição"
          containerClass="col-span-full"
        >
          <TextField
            multiline
            minRows={6}
            style={{ width: "100%", resize: "vertical" }}
            value={formData?.description || ""}
            disabled
          />
        </FormField>

        <FormField
          label="Atribuida para"
          info="Usuário para quem foi atribuida esta OS."
          containerClass="col-span-full md:col-span-4"
        >
          <TextField
            required
            placeholder="nome_exemplo"
            type="text"
            fullWidth
            value={formData?.assigned_to?.name || ""}
            disabled
          />
        </FormField>

        <FormField
          label="Atribuida por"
          info="Usuário que atribuiu a OS para outro usuário."
          containerClass="col-span-full md:col-span-4"
        >
          <TextField
            required
            placeholder="nome_exemplo"
            type="text"
            fullWidth
            value={formData?.assigned_by?.name || ""}
            disabled
          />
        </FormField>

        <FormField
          label="Empresa"
          info="Empresa relacionada a esta OS."
          containerClass="col-span-full md:col-span-4"
        >
          <TextField
            required
            type="text"
            fullWidth
            value={formData?.company?.name || ""}
            disabled
          />
        </FormField>

        <FormField
          containerClass="col-span-full md:col-span-3"
        >
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<UploadOutlined fontSize="small" />}
            >
              Anexar arquivo
            </Button>
            <div className="flex items-center gap-2 flex-1 min-w-0 border rounded px-3 py-2 bg-gray-50">
              <UploadFile fontSize="small" className="text-gray-500" />

              <span className="truncate text-sm text-gray-700">
                exemplo_arquivado.pdf
              </span>

              <IconButton size="small" color="error">
                <RemoveCircleOutline fontSize="small" />
              </IconButton>
            </div>
          </div>
        </FormField>

        <FormField
          label="Arquivos anexados"
          containerClass="col-span-full"
        >
          <TextField
            multiline
            minRows={6}
            style={{ width: "100%", resize: "vertical" }}
            value={formData?.attached_files || "Não há arquivos anexados."}
            disabled
          />
        </FormField>

      </form>

    </div>
  );
};

export default WorkOrderView;
