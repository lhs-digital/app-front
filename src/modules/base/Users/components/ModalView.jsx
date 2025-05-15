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
import api from "../../../../services/api";

const ModalView = ({ selectedUser, isOpen, onClose, viewOnly, setRefresh }) => {
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
            params: { company_id: selectedUser.company.id },
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

        setName(selectedUser?.name || "");
        setEmail(selectedUser?.email || "");
        setRole(selectedUser?.role?.id || "");
        setCompany(selectedUser?.company?.id || "");
      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };

    getData();
  }, [selectedUser]);

  const rolesFromCompany = async (companyId) => {
    try {
      const response = await api.get(`/roles/roles_from_company`, {
        params: {
          company_id: companyId,
        },
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
        await api.put(`/users/${selectedUser.id}`, {
          name,
          email,
          company_id: company,
          role_id: role,
        });
      } else {
        await api.put(`/users/${selectedUser.id}`, {
          name,
          email,
          role_id: role,
        });
      }

      setRefresh((prev) => !prev);
      toast.success("Usuário Editado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
    }
  };

  const handleSave = () => {
    if (!name || !email || !role) {
      toast.warning("Preencha os campos obrigatórios: Nome, E-mail e Role");
      return;
    }

    saveData();

    setRefresh((prev) => !prev);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {viewOnly
          ? `Visualizar Usuário: ${selectedUser.name}`
          : `Editar Usuário: ${selectedUser.name}`}
      </DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        <div>
          <InputLabel htmlFor="name">Nome</InputLabel>
          <TextField
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={viewOnly}
            fullWidth
            margin="dense"
          />
        </div>
        <div>
          <InputLabel htmlFor="email">Email</InputLabel>
          <TextField
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled
            margin="dense"
          />
        </div>
        <Box>
          <InputLabel>Empresa</InputLabel>
          <Select
            placeholder="Selecione uma opção"
            value={company}
            onChange={handleCompanyChange}
            disabled={!user.isLighthouse || viewOnly}
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
            value={role}
            onChange={handleRoleChange}
            fullWidth
            disabled={viewOnly}
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
        <Button onClick={onClose}>Voltar</Button>
        {!viewOnly && <Button onClick={handleSave}>Salvar</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default ModalView;
