import {
  ArrowBack,
  CalendarToday,
  Cancel,
  Delete,
  DeleteForever,
  Download,
  Edit,
  RemoveCircleOutline,
  Save,
  UploadFile,
  UploadOutlined,
  WorkOutline,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "../../../../components/FormField";
import PageTitle from "../../../../layout/components/PageTitle";
import api from "../../../../services/api";
import { statusInfo } from "../utils";
import { useThemeMode } from "../../../../contexts/themeModeContext";

import ModalDelete from "../../../../components/ModalDelete";
import AuditItemTable from "./AuditItemTable";

const WorkOrderView = () => {
  const [pendingUpdates, setPendingUpdates] = useState({
    fields: false,
    assignment: false,
    status: false,
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const deadlineInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState();
  const [attachedFiles, setAttachedFiles] = useState([]);
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);
  const [modalState, setModalState] = useState({
    type: null,
    mode: "create",
    isOpen: false,
  });

  const { mutate: deleteWorkOrder } = useMutation({
    mutationFn: async (id) => await api.delete(`/work_orders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["work_orders"]);
      navigate("/ordens-de-servico");
      toast.success("Ordem de serviço removida com sucesso!");
      setModalState({ type: null, isOpen: false });
      setDeleteId(null);
    },
    onError: (error) => {
      console.error("Erro ao verificar lista de ordens de serviço", error);
      toast.error("Erro ao remover ordem de serviço");
    },
  });

  const {
    data: assignment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["assignment", id],
    queryFn: async () => {
      const response = await api.get(`/work_orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const companyId = assignment?.company_id;
  const auditRecordId = assignment?.entity?.id;

  const { data: auditRecord, isLoading: auditLoading } = useQuery({
    queryKey: ["auditRecord", companyId, auditRecordId],
    enabled: !!companyId && !!auditRecordId,
    queryFn: async () => {
      const response = await api.get(`/companies/${companyId}/audit/${auditRecordId}`);
      return response.data.data;
    },
  });

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
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

  const { mutate: updateWorkOrder, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await api.put(`/work_orders/${id}`, {
          description: data.description,
          corrective_actions: data.corrective_actions,
          deadline: data.deadline,
          is_persistent_error: data.is_persistent_error,
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar ordem de serviço:", error);
        throw error;
      }
    },
    onSuccess: () => {
      const updates = [];
      if (formData?.description !== assignment?.description) updates.push("Descrição");
      if (formData?.corrective_actions !== assignment?.corrective_actions) updates.push("Ações corretivas");
      if (formData?.is_persistent_error !== assignment?.is_persistent_error) updates.push("Erro persistente");
      if (formData?.deadline !== assignment?.deadline) updates.push("Prazo");

      if (updates.length > 0) {
        toast.success(`${updates.join(", ")} atualizado(s) com sucesso!`);
      }
      setPendingUpdates(prev => ({ ...prev, fields: false }));
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao atualizar ordem de serviço", error);
      toast.error("Erro ao atualizar a ordem de serviço");
      setPendingUpdates(prev => ({ ...prev, fields: false }));
    },
  });

  const { mutate: updateWorkOrderStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: async (status) => {
      try {
        const response = await api.put(`/work_orders/${id}/status`, {
          status,
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      setPendingUpdates(prev => ({ ...prev, status: false }));
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao atualizar status", error);
      toast.error("Erro ao atualizar o status");
      setPendingUpdates(prev => ({ ...prev, status: false }));
    },
  });

  const { mutate: reassignWorkOrder, isPending: isReassigning } = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await api.put(`/work_orders/${id}/assign`, {
          assigned_to: typeof data.assigned_to === "object" ? data.assigned_to.id : data.assigned_to,
          assigned_by: typeof data.assigned_by === "object" ? data.assigned_by.id : data.assigned_by,
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao reatribuir ordem de serviço:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Usuários atualizados com sucesso!");
      setPendingUpdates(prev => ({ ...prev, assignment: false }));
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao reatribuir ordem de serviço", error);
      toast.error("Erro ao reatribuir a ordem de serviço");
      setPendingUpdates(prev => ({ ...prev, assignment: false }));
    },
  });

  const { mutate: uploadEvidences, isPending: isUploading } = useMutation({
    mutationFn: async () => {
      if (attachedFiles.length === 0) {
        throw new Error("Nenhum arquivo para enviar");
      }

      const uploadPromises = attachedFiles.map((file) => {
        const formData = new FormData();
        formData.append("file", file.file);

        if (file.description) {
          formData.append("description", file.description);
        }

        return api.post(`/work_orders/${id}/evidences`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      });

      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      toast.success("Evidências enviadas com sucesso!");
      setAttachedFiles([]);
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao enviar evidências:", error);
      toast.error("Erro ao enviar evidências");
    },
  });

  const { mutate: deleteEvidence, isPending: isDeleting } = useMutation({
    mutationFn: async (evidenceId) => {
      await api.delete(`/work_orders/${id}/evidences/${evidenceId}`);
      return null;
    },
    onSuccess: () => {
      toast.success("Evidência removida com sucesso!");
      refetch();
    },
    onError: (error) => {
      console.error("Erro ao remover evidência:", error);
      toast.error("Erro ao remover evidência");
    },
  });

  useEffect(() => {
    if (assignment) {
      setFormData(assignment);
    }
  }, [assignment]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setModalState({ type: "delete", isOpen: true });
  };

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
      toast.error(
        "Ações corretivas são obrigatórias quando status é 'Corrigido'",
      );
      return;
    }

    if (!formData?.assigned_to) {
      toast.error("Selecione um usuário para atribuir a OS");
      return;
    }

    if (!formData?.assigned_by) {
      toast.error("Selecione um usuário que atribuiu a OS");
      return;
    }

    const hasFieldChanges =
      formData?.description !== assignment?.description ||
      formData?.corrective_actions !== assignment?.corrective_actions ||
      formData?.is_persistent_error !== assignment?.is_persistent_error ||
      formData?.deadline !== assignment?.deadline;

    const hasAssignmentChanges =
      formData?.assigned_to !== assignment?.assigned_to ||
      formData?.assigned_by !== assignment?.assigned_by;

    const hasStatusChange = formData?.status !== assignment?.status;

    if (!hasFieldChanges && !hasAssignmentChanges && !hasStatusChange) {
      toast.info("Nenhuma mudança foi realizada");
      setIsEditing(false);
      return;
    }

    if (hasFieldChanges) {
      const dataToUpdate = {
        description: formData?.description,
        corrective_actions: formData?.corrective_actions,
        is_persistent_error: formData?.is_persistent_error,
        deadline: formData?.deadline,
      };
      setPendingUpdates(prev => ({ ...prev, fields: true }));
      updateWorkOrder(dataToUpdate);
    }

    if (hasAssignmentChanges) {
      const assignmentData = {
        assigned_to: formData?.assigned_to,
        assigned_by: formData?.assigned_by,
      };
      setPendingUpdates(prev => ({ ...prev, assignment: true }));
      reassignWorkOrder(assignmentData);
    }

    if (hasStatusChange) {
      setPendingUpdates(prev => ({ ...prev, status: true }));
      updateWorkOrderStatus(formData?.status);
    }

    setTimeout(() => {
      setIsEditing(false);
    }, 500);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(assignment);
  };

  const handleFileAttach = (event) => {
    const files = Array.from(event.target.files || []);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const newFiles = files
      .filter((file) => {
        if (file.type !== "application/pdf") {
          toast.error(`${file.name} - Apenas arquivos PDF são aceitos`);
          return false;
        }

        if (file.size > MAX_FILE_SIZE) {
          toast.error(
            `${file.name} - Arquivo excede o tamanho máximo de 10 MB`,
          );
          return false;
        }

        return true;
      })
      .map((file) => ({
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        size: file.size,
        file: file,
        description: "",
      }));

    setAttachedFiles([...attachedFiles, ...newFiles]);
    event.target.value = "";
  };

  const handleRemoveFile = (fileId) => {
    setAttachedFiles(attachedFiles.filter((f) => f.id !== fileId));
  };

  const handleFileDescriptionChange = (fileId, description) => {
    setAttachedFiles(attachedFiles.map((f) =>
      f.id === fileId ? { ...f, description } : f
    ));
  };

  const handleDownloadFile = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = `${filePath}`;
    link.download = fileName;
    link.click();
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
      <ModalDelete
        isOpen={modalState.type === "delete" && modalState.isOpen}
        message="Você tem certeza que deseja excluir esta Ordem de Serviço?"
        onClose={() => {
          setModalState({ type: null, isOpen: false });
          setDeleteId(null);
        }}
        onConfirm={() => deleteWorkOrder(deleteId)}
      />
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
          <Button
            key="cancel-button"
            variant="outlined"
            color="error"
            startIcon={<DeleteForever />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(id);
            }}
            disabled={isUpdating || isUpdatingStatus || isReassigning}
          >
            Excluir
          </Button>,

          isEditing ? (
            <>

              <Button
                key="cancel-button"
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isUpdating || isUpdatingStatus || isReassigning}
              >
                Cancelar
              </Button>

              <Button
                key="save-button"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={isUpdating || isUpdatingStatus || isReassigning}
              >
                {isUpdating || isUpdatingStatus || isReassigning ? <CircularProgress size={20} /> : "Salvar"}
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

      <form id="os-form" className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
          containerClass="col-span-full md:col-span-2"
        >
          <TextField
            required
            type="datetime-local"
            fullWidth
            sx={{
              "& input[type='datetime-local']::-webkit-calendar-picker-indicator": {
                filter: mode === "dark" ? "invert(1)" : "none",
                cursor: "pointer",
              },
            }}
            value={
              formData?.deadline
                ? new Date(formData?.deadline).toISOString().slice(0, 16)
                : ""
            }
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
          label="Empresa"
          info="Empresa relacionada a esta OS."
          containerClass="col-span-full md:col-span-2"
        >
          <TextField
            required
            type="text"
            fullWidth
            value={formData?.company_id || ""}
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
            <FormControlLabel
              disabled={!isEditing}
              value="yes"
              control={<Radio />}
              label="Sim"
            />
            <FormControlLabel
              disabled={!isEditing}
              value="no"
              control={<Radio />}
              label="Não"
            />
          </RadioGroup>
        </FormField>


        {formData?.status === "corrected" && (
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

        <FormField required label="Descrição" containerClass="col-span-full md:col-span-6">
          <TextField
            type="text"
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

        <FormField required label="Ações Corretivas" containerClass="col-span-full md:col-span-6">
          <TextField
            type="text"
            minRows={6}
            style={{ width: "100%", resize: "vertical" }}
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


        <FormField
          label="Atribuida para"
          info="Usuário para quem foi atribuida esta OS."
          containerClass="col-span-full md:col-span-4"
        >
          <Select
            required
            fullWidth
            value={formData?.assigned_to || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                assigned_to: e.target.value,
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
            value={formData?.assigned_by || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                assigned_by: e.target.value,
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

        {formData?.evidences && formData.evidences.length > 0 && (
          <FormField label="Evidências Enviadas" containerClass="col-span-full">
            <div className="flex flex-col gap-2 border rounded p-4 bg-blue-50">
              <p className="text-sm font-semibold text-zinc-700">
                {formData.evidences.length} arquivo(s) salvo(s)
              </p>
              {formData.evidences.map((evidence) => (
                <div
                  key={evidence.id}
                  className="flex items-center justify-between gap-3 p-3 bg-white border rounded hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <UploadFile
                      fontSize="small"
                      className="text-blue-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-800 truncate">
                        {evidence.file_name}
                      </p>
                      <div className="flex gap-2 text-xs text-zinc-500">
                        <span>{(evidence.file_size / 1024).toFixed(2)} KB</span>
                        {evidence.description && (
                          <span className="italic">"{evidence.description}"</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() =>
                      handleDownloadFile(evidence.file_path, evidence.file_name)
                    }
                    title="Baixar arquivo"
                  >
                    <Download fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteEvidence(evidence.id)}
                    disabled={isDeleting}
                    title="Remover comprovante"
                    disabled={!isEditing}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          </FormField>
        )}

        <FormField containerClass="col-span-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <input
                id="file-input"
                type="file"
                multiple
                accept="application/pdf"
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
                Anexar PDF (máx. 10 MB)
              </Button>
            </div>

            {attachedFiles.length > 0 && (
              <div className="flex flex-col gap-2 border rounded p-4 bg-zinc-50">
                <p className="text-sm font-semibold text-zinc-700">
                  Arquivos anexados ({attachedFiles.length})
                </p>
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col gap-3 p-3 bg-white border-none rounded hover:bg-zinc-100 transition"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <UploadFile
                          fontSize="small"
                          className="text-zinc-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-zinc-500">
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

                    {isEditing && (
                      <TextField
                        size="small"
                        className="bg-[#121212] border-sm"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                              borderColor: "transparent",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "transparent",
                            },
                          },
                        }}
                        placeholder="Descrição opcional (máx. 500 caracteres)"
                        fullWidth
                        multiline
                        maxRows={3}
                        value={file?.description}
                        onChange={(e) =>
                          handleFileDescriptionChange(
                            file.id,
                            e.target.value.slice(0, 500),
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {attachedFiles.length === 0 && (
              <div className="flex items-center justify-center gap-2 p-4 bg-zinc-50 border border-dashed rounded text-zinc-500">
                <UploadFile fontSize="small" />
                <span className="text-sm">Nenhum arquivo anexado ainda</span>
              </div>
            )}

            {attachedFiles.length > 0 && (
              <Button
                variant="contained"
                color="success"
                startIcon={<UploadFile fontSize="small" />}
                onClick={() => uploadEvidences()}
                disabled={isUploading}
                fullWidth
              >
                {isUploading ? <CircularProgress size={20} /> : "Salvar Anexos"}
              </Button>
            )}
          </div>
        </FormField>
      </form>

      {auditRecord && (
        <div className="mt-8 flex flex-col gap-4">
          <PageTitle
            title={`Item Auditado #${String(assignment?.entity?.id).padStart(4, "0")}`}
            subtitle="Informações do Item Auditado relacionado a esta Ordem de Serviço"
          />
          <AuditItemTable item={auditRecord} />
        </div>
      )}

    </div>
  );
};

export default WorkOrderView;
