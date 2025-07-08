import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Tabs,
  Tab,
  Divider,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../../services/api";

const ModalViewCompany = ({ isOpen, onClose, selectedCompany }) => {
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [connection, setConnection] = useState();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const getData = async () => {
      if (!selectedCompany?.id) return;
      try {
        const responseRole = await api.get(`/roles/roles_from_company`, {
          params: { company_id: selectedCompany.id },
        });
        setRoles(responseRole.data.data);

        const responseIntegration = await api.get(`/companies/${selectedCompany.id}/connection`);
        setConnection(responseIntegration.data.data);
      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };
    getData();
  }, [setRoles, selectedCompany]);
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Empresa - {selectedCompany?.name}</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tab label="Informações Gerais" />
          <Tab label="Configurações" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
              <Box>
                <b>Razão Social:</b> {selectedCompany?.name}
              </Box>
              <Box>
                <b>Nome Fantasia:</b> {selectedCompany?.dba || "Não informado"}
              </Box>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
              <Box>
                <b>CNPJ:</b> {selectedCompany?.cnpj}
              </Box>
              <Box>
                <b>CPF da Pessoa Responsável pela Empresa:</b>{" "}
                {selectedCompany?.responsible_cpf}
              </Box>
            </Box>
            <Divider
              sx={{ my: 2 }}
              style={{ borderColor: "#ccc" }}
            />

            <Typography sx={{ mt: 2, mb: 1 }}>
              <b>Endereço:</b>
            </Typography>
            <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
              <Box>
                <b>CEP:</b> {selectedCompany?.address?.postal_code || "Não informado"}
              </Box>
              <Box>
                <b>Logradouro:</b> {selectedCompany?.address?.street || "Não informado"}
              </Box>
              <Box>
                <b>Número:</b> {selectedCompany?.address?.number || "Não informado"}
              </Box>
              <Box>
                <b>Complemento:</b> {selectedCompany?.address?.complement || "Não informado"}
              </Box>
            </Box>
            <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
              <Box>
                <b>Bairro:</b> {selectedCompany?.address?.neighborhood || "Não informado"}
              </Box>
              <Box>
                <b>Cidade:</b> {selectedCompany?.address?.city || "Não informado"}
              </Box>
              <Box>
                <b>Estado:</b> {selectedCompany?.address?.state || "Não informado"}
              </Box>
              <Box>
                <b>País:</b> {selectedCompany?.address?.country || "Não informado"}
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>            <Typography sx={{ mb: 1 }}>
            <b>Cargos Cadastrados:</b>
          </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {roles.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum cargo foi encontrado
                </Typography>
              ) : (
                roles?.map((role) => (
                  <Chip
                    key={role.id}
                    label={role.name}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                ))
              )}
            </Box>
            <Divider
              sx={{ my: 2 }}
              style={{ borderColor: "#ccc" }}
            />
            <Typography sx={{ mb: 1 }}>
              <b>Informações de Conexão:</b>
            </Typography>

            <Box>
              {connection?.type === 'db' ? (
                <>
                  <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
                    <Box>
                      <b>Tipo de Integração:</b>{' '}
                      {{
                        db: 'Banco de Dados',
                        api: 'API',
                      }[connection?.type] || 'Não informado'}
                    </Box>
                    <Box>
                      <b>Driver:</b>{' '}
                      {{
                        mysql: 'MySQL',
                        postgresql: 'PostgreSQL',
                        sqlite: 'SQLite',
                      }[connection?.connection?.db_driver] || 'Não informado'}
                    </Box>
                    <Box>
                      <b>Host:</b> {connection?.connection?.db_host || 'Não informado'}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
                    <Box>
                      <b>Porta:</b> {connection?.connection?.db_port || 'Não informado'}
                    </Box>
                    <Box>
                      <b>Nome do Banco de Dados:</b> {connection?.connection?.db_name || 'Não informado'}
                    </Box>
                    <Box>
                      <b>Usuário:</b> {connection?.connection?.db_username || 'Não informado'}
                    </Box>
                  </Box>
                </>
              ) : connection?.type === 'api' ? (
                <>
                  <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
                    <Box>
                      <b>Tipo de Integração:</b> API
                    </Box>
                    <Box>
                      <b>URL Base:</b> {connection?.connection?.api_base_url || 'Não informado'}
                    </Box>
                  </Box>

                  <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
                    <Box>
                      <b>Token de Autenticação:</b> {connection?.connection?.api_token || 'Não informado'}
                    </Box>
                    <Box>
                      <b>Tipo de Autenticação:</b>  {{
                        basic: 'Basic',
                        bearer: 'Bearer'
                      }[connection?.connection?.api_auth_type] || 'Não informado'}
                    </Box>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma conexão configurada
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalViewCompany;