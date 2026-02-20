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
import api from "../../../../services/api";
import { assignmentsMock } from "../assignment_mock";
import FormField from "../../../../components/FormField";
import { statusInfo } from "../utils";

const WorkOrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);

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

  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await api.get("/users");
        return response.data?.data || [];
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        throw err;
      }
    },
  });

  const { mutate: saveAssignment, isPending: isSaving } = useMutation({
    mutationFn: async (data) => {
      const consolidatedData = {
        id,
        entity_type: formData?.entity_type,
        entity_id: formData?.entity_id,
        assigned_to: data.assigned_to,
        assigned_by: data.assigned_by,
        company_id: formData?.company_id,
        description: data.description,
        corrective_actions: data.corrective_actions,
        deadline: data.deadline,
        is_completed: formData?.is_completed,
        status: data.status,
        reopen_count: formData?.reopen_count,
        is_persistent_error: data.is_persistent_error,
        company: formData?.company,
        entity: formData?.entity,
        attached_files: attachedFiles.map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
        })),
      };

      console.log("=== SALVANDO ORDEM DE SERVIÇO ===");
      console.log("Dados consolidados:", consolidatedData);
      console.log("Arquivos para upload:", attachedFiles);
      console.log("====================================");

    },
    onSuccess: () => {
      // setIsEditing(false);
      // setFormData(null);
      // setAttachedFiles([]);
      // toast.success("Ordem de serviço atualizada com sucesso!");
      // refetch();
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

  useEffect(() => {
    if (users.length > 0 && formData) {
      const assignedToMatch = users.find(u => u.id === formData?.assigned_to?.id);
      const assignedByMatch = users.find(u => u.id === formData?.assigned_by?.id);
    }
  }, [users, formData]);

  const handleSave = () => {
    if (!formData?.status) {
      toast.error("Status é obrigatório");
      return;
    }

    if (!formData?.description) {
      toast.error("Descrição é obrigatória");
      return;
    }

    if (formData?.status === "corrected" && !formData?.corrective_actions) {
      toast.error("Ações corretivas são obrigatórias quando status é 'Corrigido'");
      return;
    }

    if (!formData?.assigned_to?.id) {
      toast.error("Selecione um usuário para atribuir a OS");
      return;
    }

    if (!formData?.assigned_by?.id) {
      toast.error("Selecione um usuário que atribuiu a OS");
      return;
    }

    const dataToSave = {
      status: formData?.status,
      description: formData?.description,
      corrective_actions: formData?.corrective_actions,
      is_persistent_error: formData?.is_persistent_error,
      assigned_to: formData?.assigned_to,
      assigned_by: formData?.assigned_by,
      deadline: formData?.deadline,
    };

    saveAssignment(dataToSave);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(null);
  };

  const handleFileAttach = (event) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      size: file.size,
      file: file,
    }));
    setAttachedFiles([...attachedFiles, ...newFiles]);
    event.target.value = "";
  };

  const handleRemoveFile = (fileId) => {
    setAttachedFiles(attachedFiles.filter((f) => f.id !== fileId));
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
            onChange={(e) => {
              if (isEditing) {
                setFormData({
                  ...formData,
                  status: e.target.value,
                });
              }
            }}
            disabled={!isEditing}
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
            onChange={(e) => {
              if (isEditing) {
                setFormData({
                  ...formData,
                  reopening_count: e.target.value,
                });
              }
            }}
            disabled={!isEditing}
          />
        </FormField>

        <FormField
          label="Prazo de Conclusão"
          info="Prazo para conclusão da Ordem de Serviço."
          containerClass="col-span-full md:col-span-3"
        >
          <TextField
            required
            type="datetime-local"
            fullWidth
            value={formData?.deadline ? new Date(formData?.deadline).toISOString().slice(0, 16) : ""}
            onChange={(e) => {
              if (isEditing && e.target.value) {
                setFormData({
                  ...formData,
                  deadline: new Date(e.target.value).toISOString(),
                });
              }
            }}
            disabled={!isEditing}
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
            <FormControlLabel disabled={!isEditing} value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel disabled={!isEditing} value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormField>

        {formData?.status === 'corrected' && (
          <FormField
            label="Ações Corretivas"
            info="Ações realizadas para a correção da OS."
            containerClass="col-span-full md:col-span-4"
          >
            <TextField
              required
              placeholder="Remoção de caracteres especiais"
              type="text"
              fullWidth
              value={formData?.corrective_actions || ""}
              onChange={(e) => {
                if (isEditing) {
                  setFormData({
                    ...formData,
                    corrective_actions: e.target.value,
                  });
                }
              }}
              disabled={!isEditing}
            />
          </FormField>
        )}

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
            onChange={(e) => {
              if (isEditing) {
                setFormData({
                  ...formData,
                  description: e.target.value,
                });
              }
            }}
            disabled={!isEditing}
          />
        </FormField>

        <FormField
          label="Atribuida para"
          info="Usuário para quem foi atribuida esta OS."
          containerClass="col-span-full md:col-span-4"
        >
          <Select
            required
            fullWidth
            value={formData?.assigned_to?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                assigned_to: users.find((user) => user.id === e.target.value) || formData?.assigned_to,
              })
            }
            disabled={!isEditing}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormField>

        <FormField
          label="Atribuida por"
          info="Usuário que atribuiu a OS para outro usuário."
          containerClass="col-span-full md:col-span-4"
        >
          <Select
            required
            fullWidth
            value={formData?.assigned_by?.id || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                assigned_by: users.find((user) => user.id === e.target.value) || formData?.assigned_by,
              })
            }
            disabled={!isEditing}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
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
          containerClass="col-span-full"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <input
                id="file-input"
                type="file"
                multiple
                onChange={handleFileAttach}
                disabled={!isEditing}
                style={{ display: "none" }}
              />
              <Button
                variant="outlined"
                color="primary"
                startIcon={<UploadOutlined fontSize="small" />}
                onClick={() => document.getElementById("file-input").click()}
                disabled={!isEditing}
              >
                Anexar arquivo
              </Button>
            </div>

            {attachedFiles.length > 0 && (
              <div className="flex flex-col gap-2 border rounded p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">
                  Arquivos anexados ({attachedFiles.length})
                </p>
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-3 p-3 bg-white border rounded hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <UploadFile fontSize="small" className="text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveFile(file.id)}
                      disabled={!isEditing}
                    >
                      <RemoveCircleOutline fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}

            {attachedFiles.length === 0 && (
              <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 border border-dashed rounded text-gray-500">
                <UploadFile fontSize="small" />
                <span className="text-sm">Nenhum arquivo anexado ainda</span>
              </div>
            )}
          </div>
        </FormField>

        

      </form>

    </div>
  );
};

export default WorkOrderView;
