import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../services/api";

const ModalIntegration = ({ isOpen, onClose, setRefresh }) => {
  const [type, setType] = useState("db");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [apiAuthType, setApiAuthType] = useState("bearer");
  const [dbDriver, setDbDriver] = useState("mysql");
  const [dbHost, setDbHost] = useState("");
  const [dbPort, setDbPort] = useState("");
  const [dbName, setDbName] = useState("");
  const [dbUsername, setDbUsername] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [buttonSave, setButtonSave] = useState(true);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const responseCompany = await api.get(`/companies/get_companies`);
        setCompanies(responseCompany?.data?.data);
        console.log("Empresas:", responseCompany?.data?.data);
      } catch (error) {
        console.error("Erro ao acessar a lista de empresas.", error);
      }
    };

    getCompanies();
  }, []);

  useEffect(() => {
    const getIntegration = async () => {
      if (!company) return;
      
      try {
        const responseIntegration = await api.get(`/companies/${company}/connection`);

        console.log("Integração:", responseIntegration);

        if (responseIntegration.data.data) {
          if (responseIntegration.data.data.type === "api") {
            setType("api");
            setBaseUrl(responseIntegration.data.data.connection.api_base_url);
            setApiToken(responseIntegration.data.data.connection.api_token);
            setApiAuthType(responseIntegration.data.data.connection.api_auth_type);
          } else {
            setType("db");
            setDbDriver(responseIntegration.data.data.connection.db_driver);
            setDbHost(responseIntegration.data.data.connection.db_host);
            setDbPort(responseIntegration.data.data.connection.db_port);
            setDbName(responseIntegration.data.data.connection.db_name);
            setDbUsername(responseIntegration.data.data.connection.db_username);
            setDbPassword(responseIntegration.data.data.connection.db_password);
          }
        }
      } catch (error) {
        console.error("Erro ao acessar dados de integração.", error);
      }
    };

    getIntegration();
  }, [company]);

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  };


  const saveData = async (integrationData) => {
    try {
      await api.put(`/companies/${company}/update_connection`, integrationData);

      setRefresh((prev) => !prev);
      toast.success("Integração configurada com sucesso!");
    } catch (error) {
      toast.error("Erro ao configurar a integração." + error.response?.data?.message);
      console.error("Erro ao configurar a integração.", error);
    }
  }

  const handleTestConnection = async () => {
    if (!dbDriver || !dbHost || !dbPort || !dbName || !dbUsername || !dbPassword) {
      toast.error("Por favor, preencha todos os campos obrigatórios para o teste de conexão de Banco de Dados.");
      return;
    }

    const integrationData = {
      driver: dbDriver,
      host: dbHost,
      port: dbPort,
      database: dbName,
      username: dbUsername,
      password: dbPassword,
    };

    try {
      const response = await api.post("/database/test-connection", integrationData);
      if (response.data.success) {
        toast.success("Teste de Conexão bem-sucedida!");
        setButtonSave(false);
      } else {
        toast.error(response.data.message || "Falha ao testar conexão.");
        setButtonSave(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao testar conexão.");
      setButtonSave(true);
    }
  };

  const handleSave = () => {
    if (!company) {
      toast.error("Por favor, selecione uma empresa.");
      return;
    }

    if (type === "api") {
      if (!baseUrl || !apiToken) {
        toast.error("Por favor, preencha todos os campos obrigatórios para a API.");
        return;
      }

      const integrationData = {
        type: "api",
        connection: {
          api_base_url: baseUrl,
          api_token: apiToken,
          api_auth_type: apiAuthType,
        }
      };

      saveData(integrationData)

    } else {
      if (!dbDriver || !dbHost || !dbPort || !dbName || !dbUsername || !dbPassword) {
        toast.error("Por favor, preencha todos os campos obrigatórios para o Banco de Dados.");
        return;
      }
      const integrationData = {
        type: "db",
        connection: {
          db_driver: dbDriver,
          db_host: dbHost,
          db_port: dbPort,
          db_name: dbName,
          db_username: dbUsername,
          db_password: dbPassword,
        }
      };

      saveData(integrationData)

    }

    cleanFields();

    setRefresh((prev) => !prev);
    onClose();
  };

  const cleanFields = () => {
    setCompany("");
    setType("db");
    setBaseUrl("");
    setApiToken("");
    setApiAuthType("bearer");
    setDbDriver("mysql");
    setDbHost("");
    setDbPort("");
    setDbName("");
    setDbUsername("");
    setDbPassword("");
    setButtonSave(true);
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{"Configurar Integração"}</DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        <Box className="flex gap-2">
          <Box className="flex-1">
            <InputLabel>Empresa *</InputLabel>
            <Select
              placeholder="Selecione uma opção"
              value={company}
              onChange={handleCompanyChange}
              fullWidth
            >
              {console.log("Empresas:", companies)}
              {companies.map((companyItem) => (
                <MenuItem key={companyItem.id} value={companyItem.id}>
                  {companyItem.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <InputLabel>Tipo de Integração *</InputLabel>
            <Select value={type} fullWidth onChange={(e) => setType(e.target.value)}>
              <MenuItem value={"api"}>API</MenuItem>
              <MenuItem value={"db"}>Banco de Dados</MenuItem>
            </Select>
          </Box>

        </Box>


        {
          type === "api" ? (
            <>
              <Box>
                <InputLabel>Base URL *</InputLabel>
                <TextField
                  fullWidth
                  placeholder="https://api.exemplo.com"
                  variant="outlined"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                />
              </Box>
              <Box>
                <InputLabel>Token de Acesso *</InputLabel>
                <TextField
                  fullWidth
                  placeholder="Seu token de acesso"
                  variant="outlined"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                />
              </Box>
              <Box>
                <InputLabel>Tipo de Autenticação</InputLabel>
                <Select
                  fullWidth
                  value={apiAuthType}
                  onChange={(e) => setApiAuthType(e.target.value)}
                >
                  <MenuItem value={"bearer"}>Bearer</MenuItem>
                  <MenuItem value={"basic"}>Basic</MenuItem>
                </Select>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <InputLabel>Driver *</InputLabel>
                <Select
                  fullWidth
                  value={dbDriver}
                  onChange={(e) => setDbDriver(e.target.value)}
                >
                  <MenuItem value={"mysql"}>MySQL</MenuItem>
                  <MenuItem value={"postgres"}>PostgreSQL</MenuItem>
                  <MenuItem value={"sqlite"}>SQLite</MenuItem>
                </Select>
              </Box>
              <Box className="flex gap-2">
                <Box>
                  <InputLabel>Host *</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="localhost"
                    variant="outlined"
                    value={dbHost}
                    onChange={(e) => setDbHost(e.target.value)}
                  />
                </Box>
                <Box>
                  <InputLabel>Porta *</InputLabel>
                  <TextField
                    fullWidth
                    placeholder="3306"
                    variant="outlined"
                    value={dbPort}
                    onChange={(e) => setDbPort(e.target.value)}
                  />
                </Box>
              </Box>
              <Box>
                <InputLabel>Nome do Banco de Dados *</InputLabel>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                />
              </Box>
              <Box className="flex gap-2">
                <Box>

                  <InputLabel>Usuário *</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={dbUsername}
                    onChange={(e) => setDbUsername(e.target.value)}
                  />
                </Box>
                <Box>
                  <InputLabel>Senha *</InputLabel>
                  <TextField
                    fullWidth
                    type="password"
                    variant="outlined"
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                  />
                </Box>
              </Box>
            </>
          )
        }

      </DialogContent>
      <DialogActions>
        <Button
          color="info"
          mr={3}
          onClick={() => {
            onClose(), cleanFields();
          }}
        >
          CANCELAR
        </Button>
        {type === "db" && (
          <Button color="primary" onClick={handleTestConnection}>
            TESTAR CONEXÃO
          </Button>
        )}
        <Button color="primary" onClick={handleSave} disabled={buttonSave && type === "db"}>
          SALVAR
        </Button>
      </DialogActions>
    </Dialog >
  );
};

export default ModalIntegration;