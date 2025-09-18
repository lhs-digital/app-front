import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Divider,
  Chip,
} from "@mui/material";
import { useState } from "react";

const ModalViewVPN = ({ isOpen, onClose, selectedVpn }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Visualizar VPN</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tab label="Informações Gerais" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
              <Box>
                <b>Nome da VPN:</b> {selectedVpn?.name}
              </Box>
              <Box>
                <b>Status:</b> {selectedVpn?.status === 'active' ? <Chip label="Ativo" color="success" size="small" /> : <Chip label="Inativo" color="error" size="small" />}
              </Box>
            </Box>
            <Divider sx={{ mb: 1, width: '60%' }} />
            <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
              <Box>
                <b>Empresa:</b> {selectedVpn?.company?.name}
              </Box>
              <Box>
                <b>CNPJ:</b>{" "}
                {selectedVpn?.company?.cnpj}
              </Box>
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

export default ModalViewVPN;