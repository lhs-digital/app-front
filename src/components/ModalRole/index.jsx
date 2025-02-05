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

const ModalRole = ({ dataEdit, isOpen, onClose, setRefresh, refresh }) => {
  const [name, setName] = useState("");
  const [nivel, setNivel] = useState("");
  const [company, setCompany] = useState("");
  const [rolePermissions, setRolePermissions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (dataEdit) {
      setName(dataEdit?.name || "");
      setNivel(dataEdit?.nivel !== undefined ? dataEdit.nivel : "");
      setCompany(dataEdit?.company?.id || "");
    }
  }, [dataEdit]);

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

        const responseRole = await api.get(`/roles/roles_from_company`, {
          params: { company_id: dataEdit.company.id },
        });
        setRoles(responseRole?.data?.data);

        if (dataEdit) {
          const responseRolePermissions = await api.get(`/roles/${dataEdit.id}`);
          setRolePermissions(
            responseRolePermissions.data.data.permissions.map(
              (permission) => permission.id,
            ),
          );
        }
      } catch (error) {
        console.error("Erro ao acessar as roles por empresa", error);
      }
    };
    if (isOpen) {
      getData();
    }
  }, [isOpen, dataEdit, company]);

  useEffect(() => {
    if (rolePermissions.length === permissions.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [rolePermissions, permissions]);

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
      await api.put(`/roles/${dataEdit.id}`, {
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
    if (!name || nivel === "") {
      toast.warning("Preencha os campos obrigatórios: Nome, Nível e Empresa");
      return;
    }

    const roleExists = roles.some(
      (role) =>
        role.name.toLowerCase() === name.toLowerCase() &&
        role.company_id === company &&
        (!dataEdit || role.id !== dataEdit.id)
    );

    if (roleExists) {
      toast.error("Já existe uma role com este nome para a mesma empresa!");
      return;
    }

    if (dataEdit?.id) {
      updateUser();
    } else {
      saveData();
    }

    cleanData();

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

  const cleanData = () => {
    setName("");
    setNivel("");
    setCompany("");
    setRolePermissions([]);
    setSelectAll(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{dataEdit?.id ? "Editar Role" : "Cadastrar Role"}</DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        <Box>
          <InputLabel htmlFor="name">Nome *</InputLabel>
          <TextField
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Box>
        <Box>
          <InputLabel htmlFor="nivel">Nível *</InputLabel>
          <Select
            id="nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value={2}>Baixo</MenuItem>
            <MenuItem value={1}>Médio</MenuItem>
            <MenuItem value={0}>Alto</MenuItem>
          </Select>
        </Box>
        <Box>
          <InputLabel htmlFor="company">Empresa</InputLabel>
          <Select
            id="company"
            label="Empresa"
            value={company}
            disabled={dataEdit?.company?.id}
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
          <InputLabel htmlFor="permissions">Permissões</InputLabel>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Checkbox
                id="selectAll"
                checked={selectAll}
                onChange={handleSelectAll}
                width="100%"
                inputProps={{ "aria-label": "Selecionar todas as permissões" }}
              />
              <Typography component="span">
                Selecionar todas as permissões
              </Typography>
            </Grid>

            {permissions.map((permission, index) => (
              <Fragment key={permission?.id}>
                {permission?.category !== permissions[index - 1]?.category && (
                  <>
                    <Typography marginLeft={1}>
                      <b>{permission?.category}</b>
                    </Typography>
                    <Divider />
                  </>
                )}

                <Grid item xs={12}>
                  <Checkbox
                    id={permission?.name}
                    checked={rolePermissions.includes(permission?.id)}
                    onChange={(e) => handlePermissions(e, permission?.id)}
                  />
                  <Typography component="span">{permission?.label}</Typography>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={() => { onClose(); cleanData(); }}>
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