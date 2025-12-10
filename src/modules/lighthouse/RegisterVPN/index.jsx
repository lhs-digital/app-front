import {
  Lock,
  RemoveCircleOutline,
  Save,
  SettingsOutlined,
  UploadFile,
  UploadOutlined,
} from "@mui/icons-material";
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NumberInput from "../../../components/DynamicForm/NumberInput";
import FormField from "../../../components/FormField/index";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { trimText } from "../../../services/formatters";
import { parseOVPN } from "../../../services/ovpn";
import Validator from "../../../services/validator";

const RegisterVpn = () => {
  const { company, availableCompanies } = useCompany();
  const { id } = useParams();
  const qc = useQueryClient();
  const uploadInput = useRef(null);
  const [isParsing, setIsParsing] = useState(false);
  const navigate = useNavigate();
  const uploadInputP12 = useRef(null);
  const [fileP12, setFileP12] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleFileChangeP12 = (e) => {
    setFileP12(e.target.files[0]);
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
    }, 1000);
  };

  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      password: "",
      company_id: "",
      protocol: "",
      remote_address: "",
      remote_port: "",
      route_ip: "",
      ta_key: "",
      tls_type: "",
    },
  });

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
        setValue("company_id", company.id);
        setValue("name", parsed.name);
        setValue("username", parsed.username);
        setValue("password", parsed.password);
        setValue("protocol", parsed.protocol || "udp");
        setValue("remote_address", parsed.remote_address);
        setValue("remote_port", parsed.remote_port);
        setValue("route_ip", parsed.route_ip);
        setValue("ta_key", parsed.ta_key);
        setValue("tls_type", parsed.tls_type || "auth");
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error("Erro ao ler o arquivo .ovpn.");
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = async (data) => {
    if (Object.keys(errors).length > 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    try {
      if (!Validator.isCleanString(data.name)) {
        toast.error(
          "O nome da VPN não deve conter espaços ou caracteres especiais.",
        );
        return;
      }

      setIsPending(true);

      const formData = new FormData();
      formData.append("p12_file", fileP12);
      formData.append("company_id", data.company_id);
      formData.append("name", data.name);
      formData.append("protocol", data.protocol);
      formData.append("remote_address", data.remote_address);
      formData.append("remote_port", data.remote_port);
      formData.append("route_ip", data.route_ip);
      formData.append("ta_key", data.ta_key);
      formData.append("tls_type", data.tls_type);
      formData.append("username", data.username);
      formData.append("password", data.password);

      const fn = id ? api.post : api.put;

      await fn(`/vpns/${id || ""}`, formData, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
        withCredentials: true,
      });
      toast.success(`VPN ${id ? "alterada" : "cadastrada"} com sucesso!`);
      navigate(id ? `/vpns/${id}` : "/vpns");
    } catch (error) {
      console.error(`Erro ao ${id ? "alterar" : "cadastrar"} VPN`, error);
      toast.error(
        `Erro ao ${id ? "alterar" : "cadastrar"} VPN: ${error.message}`,
      );
    } finally {
      setIsPending(false);
      qc.invalidateQueries(["vpns"]);
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
            form="vpn-form"
            type="submit"
            color="primary"
            variant="contained"
            startIcon={<Save />}
            loading={isPending}
          >
            Criar VPN
          </Button>,
        ]}
      />
      <form
        id="vpn-form"
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-5 gap-8"
      >
        <FormField
          label="Nome da VPN"
          error={!!errors.name}
          info="O nome da VPN será usado para identificar a VPN no sistema. Não deve conter espaços ou caracteres especiais."
          containerClass="col-span-full md:col-span-3"
        >
          <TextField
            error={!!errors.name}
            required
            placeholder="nome_exemplo"
            type="text"
            fullWidth
            {...register("name", { required: true })}
          />
        </FormField>
        <Controller
          name="company_id"
          control={control}
          error={!!errors.company_id}
          render={({ field }) => (
            <FormField
              label="Empresa"
              error={!!errors.company_id}
              containerClass="col-span-full md:col-span-2"
              required
            >
              <Select {...field} readOnly={!!field.value} fullWidth>
                {availableCompanies.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormField>
          )}
        />
        <Divider className="col-span-full" />
        <h2 className="col-span-full font-medium">
          <SettingsOutlined className="mb-0.5" /> Configurações
        </h2>
        <FormField required label="Protocolo" error={!!errors.protocol}>
          <Select defaultValue="udp" {...register("protocol")} fullWidth>
            <MenuItem value="tcp">TCP</MenuItem>
            <MenuItem value="udp">UDP</MenuItem>
          </Select>
        </FormField>
        <FormField
          required
          label="Endereço de Roteamento"
          error={!!errors.remote_address}
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
          error={!!errors.remote_address}
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
          error={!!errors.remote_port}
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
          error={!!errors.tls_type}
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
          label="Usuário"
          error={!!errors.username}
          containerClass="col-span-full md:col-span-1"
        >
          <TextField {...register("username", { required: true })} fullWidth />
        </FormField>
        <FormField
          required
          label="Senha"
          error={!!errors.password}
          containerClass="col-span-full md:col-span-1"
        >
          <TextField
            type="password"
            {...register("password", { required: true })}
            fullWidth
          />
        </FormField>
        <FormField
          label="Arquivo .p12"
          error={!!errors.p12_file}
          containerClass="col-span-full md:col-span-3"
          required
        >
          <div className="flex flex-row gap-4 items-center h-14 w-full">
            <input
              type="file"
              accept=".p12"
              hidden
              onChange={handleFileChangeP12}
              ref={uploadInputP12}
            />
            <Button
              onClick={() => uploadInputP12.current.click()}
              variant="contained"
              color="primary"
              className="h-full"
              startIcon={
                fileP12 ? (
                  <UploadFile fontSize="small" />
                ) : (
                  <UploadOutlined fontSize="small" />
                )
              }
            >
              {fileP12 ? "Alterar arquivo .p12" : "Carregar arquivo .p12"}
            </Button>
            {fileP12 && (
              <span className="grow">{trimText(fileP12.name, 150)}</span>
            )}
            {fileP12 && (
              <IconButton
                onClick={() => setFileP12(null)}
                color="error"
                loading={isPending}
              >
                <RemoveCircleOutline />
              </IconButton>
            )}
          </div>
        </FormField>
        <FormField
          required
          label="Chave TLS"
          error={!!errors.ta_key}
          containerClass="col-span-full"
        >
          <TextField
            multiline
            minRows={6}
            style={{ width: "100%", resize: "vertical" }}
            {...register("ta_key", { required: true })}
          />
        </FormField>
      </form>
    </div>
  );
};

export default RegisterVpn;
