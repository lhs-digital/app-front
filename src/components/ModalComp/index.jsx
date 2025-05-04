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

const ModalComp = ({ data, dataEdit, isOpen, onClose, setRefresh }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);
  const user = useAuthUser();

  useEffect(() => {
    const getData = async () => {
      try {
        if (user.isLighthouse) {
          const responseCompany = await api.get(`/companies/get_companies`);
          setCompanies(responseCompany?.data?.data);

          const responseRole = await api.get(`/roles/roles_from_company`, {
            params: { company_id: dataEdit.company.id },
          });
          setRoles(responseRole?.data?.data);
        } else {
          const responseCompany = await api.get(`/companies/get_companies`);
          setCompanies(responseCompany?.data?.data);

          const responseRole = await api.get(`/roles/roles_from_company`, {
            params: { company_id: user.company.id },
          });
          setRoles(responseRole?.data?.data);
        }
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
      if (user.isLighthouse) {
        await api.post("/users", {
          name,
          email,
          company_id: company,
          role_id: role,
        });
      } else {
        await api.post("/users", {
          name,
          email,
          role_id: role,
          password: "123456",
        });
      }

      setRefresh((prev) => !prev);
      toast.success("Usuário cadastrado com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar usuário " + error.response?.data?.message);
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

    cleanFields();

    setRefresh((prev) => !prev);
    onClose();
  };

  const cleanFields = () => {
    setName("");
    setEmail("");
    setCompany("");
    setRole("");
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
        {user.isLighthouse ? (
          <Box>
            <InputLabel>Empresa *</InputLabel>
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
        ) : (
          <Box>
            <InputLabel>Empresa *</InputLabel>
            <Select value={user.company.id} disabled fullWidth>
              <MenuItem value={user.company.id}>{user.company.name}</MenuItem>
            </Select>
          </Box>
        )}
        <Box>
          <InputLabel>Role *</InputLabel>
          <Select
            placeholder="Selecione uma opção"
            value={role?.id}
            onChange={handleRoleChange}
            disabled={!company && user.isLighthouse}
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
        <Button
          color="info"
          mr={3}
          onClick={() => {
            onClose(), cleanFields();
          }}
        >
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
