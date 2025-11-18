import {
  Lock,
  SettingsOutlined,
  UploadFile,
  VpnKey,
} from "@mui/icons-material";
import { Button, Divider, MenuItem, Select, TextField } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NumberInput from "../../../components/DynamicForm/NumberInput";
import FormField from "../../../components/FormField/index";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { parseOVPN } from "../../../services/ovpn";

const RegisterVpn = () => {
  const { company } = useCompany();
  const { id } = useParams();
  const qc = useQueryClient();
  const [fileVpn, setFileVpn] = useState(null);
  const uploadInput = useRef(null);
  const [isParsing, setIsParsing] = useState(false);
  const navigate = useNavigate();

  const { register, setValue, control } = useForm({
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

  const { data } = useQuery({
    queryKey: ["vpn", id],
    queryFn: async () => {
      const response = await api.get(`/vpns/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      setValue("name", data?.name);
    },
    enabled: !!id,
  });

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

      await api.post(`/vpns/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      qc.invalidateQueries(["vpn", id]);
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

    if (data?.id) {
      updateUser();
    } else {
      saveData();
    }

    navigate(`/vpns`);
  };

  const populateFormFields = (parsed) => {
    setValue("ca_crt", parsed.ca_crt);
    setValue("client_crt", parsed.client_crt);
    setValue("client_key", parsed.client_key);
    setValue("ta_key", parsed.ta_key);
    setValue("protocol", parsed.protocol || "udp");
    setValue("remote_address", parsed.remote_address);
    setValue("remote_port", parsed.remote_port);
    setValue("tls_type", parsed.tls_type || "auth");
  };

  const handleFileChange = (e) => {
    setIsParsing(true);
    const file = e.target.files[0];
    const fileName = file.name.toLowerCase();
    const accepted = [".ovpn", ".txt"];
    if (!accepted.some((ext) => fileName.endsWith(ext))) {
      toast.error("Por favor, selecione um arquivo .ovpn válido.");
      return;
    }

    const reader = new FileReader();
    try {
      reader.onload = (event) => {
        const parsed = parseOVPN(event.target.result);
        setFileVpn(file);
        populateFormFields(parsed);
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error("Erro ao ler o arquivo .ovpn.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageTitle
        title="Registrar VPNs"
        icon={<Lock />}
        subtitle="Administração e controle das conexões VPN da empresa"
        buttons={[
          <Button
            variant="outlined"
            key="import-button"
            component="label"
            size="large"
            loading={isParsing}
            startIcon={<UploadFile />}
            onClick={() => uploadInput.current.click()}
          >
            Importar de arquivo .ovpn
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              ref={uploadInput}
            />
          </Button>,
          <Button
            key="save-button"
            onClick={handleSave}
            color="primary"
            variant="contained"
            startIcon={<VpnKey />}
          >
            Criar VPN
          </Button>,
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <FormField
          label="Nome da VPN"
          containerClass="col-span-full md:col-span-3"
        >
          <TextField
            required
            type="text"
            fullWidth
            {...register("name", { required: true })}
          />
        </FormField>
        <FormField label="Empresa" containerClass="col-span-full md:col-span-2">
          <Select value={company.id} readOnly fullWidth>
            <MenuItem value={company.id}>{company.name}</MenuItem>
          </Select>
        </FormField>
        <Divider className="col-span-full" />
        <h2 className="col-span-full font-medium">
          <SettingsOutlined className="mb-0.5" /> Configurações
        </h2>
        <FormField required label="Protocolo">
          <Select defaultValue="udp" {...register("protocol")} fullWidth>
            <MenuItem value="tcp">TCP</MenuItem>
            <MenuItem value="udp">UDP</MenuItem>
          </Select>
        </FormField>
        <FormField
          required
          label="Endereço de Roteamento"
          containerClass="col-span-full md:col-span-1"
        >
          <TextField
            placeholder="255.255.255.255"
            {...register("remote_address", { required: true })}
            fullWidth
          />
        </FormField>
        <FormField
          required
          label="Endereço Remoto"
          containerClass="col-span-full md:col-span-1"
        >
          <TextField
            placeholder="255.255.255.255"
            {...register("remote_address", { required: true })}
            fullWidth
          />
        </FormField>
        <FormField
          required
          label="Porta Remota"
          containerClass="col-span-full md:col-span-1"
        >
          <Controller
            name="remote_port"
            rules={{ required: true }}
            control={control}
            render={({ field }) => (
              <NumberInput {...field} fullWidth required />
            )}
          />
        </FormField>
        <FormField
          required
          label="Tipo de TLS"
          containerClass="col-span-full md:col-span-1"
        >
          <Select
            defaultValue="auth"
            {...register("tls_type", { required: true })}
            fullWidth
          >
            <MenuItem value="auth">TLS-Auth</MenuItem>
            <MenuItem value="crypt">TLS-Crypt</MenuItem>
          </Select>
        </FormField>
        <FormField
          required
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
          required
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
        <FormField required label="Chave TLS" containerClass="col-span-full">
          <TextField
            multiline
            minRows={6}
            style={{ width: "100%", resize: "vertical" }}
            {...register("ta_key", { required: true })}
          />
        </FormField>
      </div>
    </div>
  );
};

export default RegisterVpn;
