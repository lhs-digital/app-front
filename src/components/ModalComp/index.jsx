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
import api from "../../services/api";

const ModalComp = ({ data, dataEdit, isOpen, onClose, setRefresh }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseCompany = await api.get(`/companies/get_companies`);
        setCompanies(responseCompany?.data?.data);

        const responseRole = await api.get(`/roles/roles_from_company`, {
          params: { company_id: dataEdit.company.id },
        });
        setRoles(responseRole?.data?.data);
      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };

    getData();
  }, [company]);

  const rolesFromCompany = async (companyId) => {
    try {
      const response = await api.get(`/roles/roles_from_company`, {
        params: { company_id: companyId },
      });
      setRoles(response?.data?.data);
    } catch (error) {
      console.error("Erro ao acessar as roles por empresa", error);
    }
  };

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    rolesFromCompany(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const saveData = async () => {
    try {
      await api.post("/users", {
        name,
        email,
        company_id: company,
        role_id: role,
      });

      setRefresh((prev) => !prev);
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
    }
  };

  const handleSave = () => {
    if (!name || !email || !role) {
      toast.warning("Preencha os campos obrigatórios: Nome, E-mail e Role");
      return;
    }

    if (emailAlreadyExists()) {
      toast.warning("E-mail já cadastrado!");
      return;
    }

    saveData();

    setRefresh((prev) => !prev);
    onClose();
  };

  const emailAlreadyExists = () => {
    if (data?.length) {
      return data.find((item) => item.email === email);
    }

    return false;
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{"Cadastrar Usuário"}</DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        <Box>
          <InputLabel>Nome *</InputLabel>
          <TextField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel>E-mail *</InputLabel>
          <TextField
            type="text"
            value={email}
            disabled={dataEdit?.email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel>Empresa</InputLabel>
          <Select
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
        <Box>
          <InputLabel>Role *</InputLabel>
          <Select
            placeholder="Selecione uma opção"
            value={role?.id}
            onChange={handleRoleChange}
            disabled={!company}
            fullWidth
          >
            {roles.map((roleItem) => (
              <MenuItem key={roleItem.id} value={roleItem.id}>
                {roleItem.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="info" mr={3} onClick={onClose}>
          CANCELAR
        </Button>
        <Button color="primary" onClick={handleSave}>
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalComp;
