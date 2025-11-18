import {
  Remove,
  SettingsOutlined,
  UploadFile,
  VpnKey,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormField from "../../../../components/FormField/index";
import { useCompany } from "../../../../hooks/useCompany";
import api from "../../../../services/api";

const ModalVpn = ({ dataEdit, isOpen, onClose, setRefresh, refresh }) => {
  const { company } = useCompany();
  const [fileVpn, setFileVpn] = useState(null);
  const uploadInput = useRef(null);

  const { register, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      ca_crt: "",
      client_crt: "",
      client_key: "",
      ta_key: "",
      protocol: "",
      remote_address: "",
      remote_port: "",
      tls_type: "",
    },
  });

  useEffect(() => {
    if (dataEdit?.id) {
      setValue("name", dataEdit?.name);
    }
  }, [dataEdit]);

  useEffect(() => {
    if (!isOpen) {
      cleanFields();
    }
  }, [isOpen]);

  const saveData = async () => {
    try {
      const formData = new FormData();
      formData.append("company_id", company?.id);
      formData.append("name", name);
      formData.append("ovpn_file", fileVpn);

      await api.post("/vpns", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setRefresh(!refresh);
      toast.success("VPN cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar VPN", error);
    }
  };

  const updateUser = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("ovpn_file", fileVpn);
      formData.append("_method", "PUT");

      await api.post(`/vpns/${dataEdit?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setRefresh(!refresh);
      toast.success("VPN alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar VPN", error);
    }
  };

  const handleSave = () => {
    if (!fileVpn) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (dataEdit?.id) {
      updateUser();
    } else {
      saveData();
    }

    cleanFields();
    onClose();
  };

  const handleFileChange = (event) => {
    setFileVpn(event.target.files[0]);
  };

  const cleanFields = () => {
    reset();
    setFileVpn(null);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{dataEdit?.id ? "Editar VPN" : "Cadastrar VPN"}</DialogTitle>
      <DialogContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <FormField
          label="Nome da VPN"
          containerClass="col-span-full md:col-span-2"
        >
          <TextField
            required
            type="text"
            fullWidth
            {...register("name", { required: true })}
          />
        </FormField>
        <FormField label="Empresa">
          <Select value={company.id} readOnly fullWidth>
            <MenuItem value={company.id}>{company.name}</MenuItem>
          </Select>
        </FormField>
        <Divider className="col-span-full" />
        <div className="col-span-full flex flex-row justify-between">
          <div className="flex flex-row gap-4 items-center">
            <Button
              variant="outlined"
              component="label"
              size="large"
              startIcon={<UploadFile />}
              onClick={() => uploadInput.current.click()}
            >
              {fileVpn ? "Alterar arquivo OVPN" : "Selecionar arquivo OVPN"}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                ref={uploadInput}
              />
            </Button>
            {fileVpn ? (
              <span>{fileVpn.name}</span>
            ) : (
              <span className="text-neutral-400">
                Nenhum arquivo selecionado
              </span>
            )}
          </div>
          {fileVpn && (
            <Tooltip>
              <IconButton>
                <Remove />
              </IconButton>
            </Tooltip>
          )}
        </div>
        <Divider className="col-span-full" />
        <h2 className="col-span-full font-medium">
          <SettingsOutlined className="mb-0.5" /> Configurações
        </h2>
        <FormField
          label="Certificado da Autoridade Certificadora (CA)"
          containerClass="col-span-full"
        >
          <TextField
            multiline
            minRows={6}
            style={{ width: "100%", resize: "vertical" }}
            {...register("ca_crt", { required: true })}
          />
        </FormField>
        <FormField
          label="Certificado do Cliente"
          containerClass="col-span-full"
        >
          <TextField
            multiline
            minRows={6}
            style={{ width: "100%", resize: "vertical" }}
            {...register("client_crt", { required: true })}
          />
        </FormField>
        <FormField label="Chave TLS" containerClass="col-span-full">
          <TextField
            multiline
            minRows={6}
            style={{ width: "100%", resize: "vertical" }}
            {...register("ta_key", { required: true })}
          />
        </FormField>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            cleanFields();
          }}
        >
          VOLTAR
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          startIcon={<VpnKey />}
        >
          Criar VPN
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalVpn;
