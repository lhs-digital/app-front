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
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast } from "react-toastify";
import api from "../../services/api";

const ModalReport = ({ isOpen, onClose }) => {
  const [createdAt, setCreatedAt] = useState([]);
  const user = useAuthUser();
  const [company, setCompany] = useState("");
  const [companyId, setCompanyId] = useState(user?.company?.id);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseCompany = await api.get(`/companies/get_companies`);
        setCompanies(responseCompany.data.data);
      } catch (error) {
        console.error("Erro ao consumir as empresas do sistema", error);
      }
    };
    getData();
  }, []);

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    setCompanyId(event.target.value);
  };

  const generateReport = async () => {
    try {
      const response = await api.get(`/report_generate`, {
        params: {
          company_id: companyId,
          start_date: createdAt[0],
          end_date: createdAt[1],
        },
        responseType: "blob",
      });

      const fileBlob = new Blob([response.data], { type: response.data.type });

      const downloadUrl = URL.createObjectURL(fileBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "relatorio.pdf";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Gerar Relatório</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={4}>
          {user?.role?.name === "super-admin" && (
            <Box display="flex" flexDirection="column" gap={1}>
              <InputLabel htmlFor="company">Empresa</InputLabel>
              <Select
                id="company"
                placeholder="Selecione uma opção"
                value={company}
                onChange={handleCompanyChange}
                fullWidth
              >
                {companies.map((companyItem) => (
                  <MenuItem key={companyItem.id} value={companyItem.id}>
                    {companyItem.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
          <Box display="flex" flexDirection="column" gap={1}>
            <InputLabel>
              Período para gerar o relatório das Auditoria *
            </InputLabel>
            <Box display="flex" alignItems="center" gap="6px">
              <TextField
                size="small"
                type="date"
                value={createdAt[0] || ""}
                onChange={(e) => setCreatedAt([e.target.value, createdAt[1]])}
                fullWidth
              />
              até
              <TextField
                size="small"
                type="date"
                value={createdAt[1] || ""}
                onChange={(e) => setCreatedAt([createdAt[0], e.target.value])}
                fullWidth
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          VOLTAR
        </Button>
        <Button color="primary" onClick={generateReport}>
          GERAR RELATÓRIO
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalReport;
