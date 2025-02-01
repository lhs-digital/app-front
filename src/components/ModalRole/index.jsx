import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const ModalRole = ({ data, isOpen, onClose, setRefresh, refresh }) => {
  const [name, setName] = useState(data?.name || "");
  const [nivel, setNivel] = useState(data?.nivel);
  const [company, setCompany] = useState(data.company?.id || "");
  const [rolePermissions, setRolePermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (!selectAll) {
      const allPermissionIds = permissions.map((permission) => permission.id);
      setRolePermissions(allPermissionIds);
    } else {
      setRolePermissions([]);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const responseCompany = await api.get(`/companies/get_companies`);
        setCompanies(responseCompany.data.data);

        const responsePermissions = await api.get(`/permissions`);
        setPermissions(responsePermissions.data.data);

        if (data) {
          const responsePermissions = await api.get(`/roles/${data.id}`);
          setRolePermissions(
            responsePermissions.data.data.permissions.map(
              (permission) => permission.id,
            ),
          );
        }
      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };
    if (isOpen && data) {
      getData();
    }
  }, [data]);

  const saveData = async () => {
    try {
      await api.post("/roles", {
        name,
        nivel,
        company_id: company,
        permissions: rolePermissions,
      });

      setRefresh(!refresh);
      toast.success("Role cadastrada com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar Role", error);
    }
  };

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  };

  const updateUser = async () => {
    try {
      await api.put(`/roles/${data.id}`, {
        name,
        nivel,
        company_id: company,
        permissions: rolePermissions,
      });

      setRefresh(!refresh);
      toast.success("Role alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao alterar Role", error);
    }
  };

  const handleSave = () => {
    if (!name || !nivel) {
      toast.warning("Preencha os campos obrigatórios: Nome, Nível e Empresa");
      return;
    }

    if (data.id) {
      updateUser();
    } else {
      saveData();
    }

    onClose();
  };

  const handlePermissions = (e, permissionId) => {
    if (e.target.checked) {
      setRolePermissions((prevPermissions) => [
        ...prevPermissions,
        permissionId,
      ]);
    } else {
      setRolePermissions((prevPermissions) =>
        prevPermissions.filter((item) => item !== permissionId),
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{data.id ? "Editar Role" : "Cadastrar Role"}</DialogTitle>
      <DialogContent>
        <Box>
          <InputLabel htmlFor="name">Nome *</InputLabel>
          <TextField
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box>
          <InputLabel htmlFor="nivel">Nível *</InputLabel>
          <TextField
            id="nivel"
            type="number"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          />
        </Box>
        <Box>
          <InputLabel htmlFor="company">Empresa</InputLabel>
          <Select
            id="company"
            label="Empresa"
            value={company}
            disabled={data.company?.id}
            onChange={handleCompanyChange}
          >
            {companies.map((companyItem) => (
              <MenuItem key={companyItem.id} value={companyItem.id}>
                {companyItem.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <InputLabel htmlFor="permissions">Permissões</InputLabel>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Checkbox
                id="selectAll"
                isChecked={selectAll}
                onChange={handleSelectAll}
                width="100%"
              />
              <Typography component="span">
                Selecionar todas as permissões
              </Typography>
            </Grid>

            {permissions.map((permission, index) => (
              <Fragment key={permission.id}>
                {permission.category !== permissions[index - 1]?.category && (
                  <>
                    <Typography>
                      <b>{permission.category}</b>
                    </Typography>
                    <Divider />
                  </>
                )}

                <Grid item xs={12}>
                  <Checkbox
                    id={permission?.name}
                    isChecked={rolePermissions.includes(permission.id)}
                    onChange={(e) => handlePermissions(e, permission.id)}
                  />
                  <Typography component="span">{permission.label}</Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          CANCELAR
        </Button>
        <Button color="primary" onClick={handleSave}>
          SALVAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalRole;
