import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const ModalViewRole = ({ selectedRole, isOpen, onClose }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    async function loadPermissions() {
      try {
        const response = await api.get(`/roles/${selectedRole?.id}`);
        setPermissions(response.data.data.permissions);
      } catch (error) {
        toast.error(error);
      }
    }

    if (isOpen && selectedRole) {
      loadPermissions();
    }
  }, [selectedRole]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Informações Gerais da Role</DialogTitle>
      <DialogContent>
        <Box>
          <b>Nome:</b> {selectedRole?.name}{" "}
        </Box>
        <Box>
          <b>Nível:</b> {selectedRole?.nivel}{" "}
        </Box>
        <Box>
          <b>Empresa:</b> {selectedRole?.company?.cnpj}{" "}
          {selectedRole?.company?.name}{" "}
        </Box>
        <Box>
          <b>Qtd. de Permissões:</b> {selectedRole?.permissions_count}{" "}
        </Box>
        <Box>
          <b>Permissões:</b>
          <Box textAlign="justify" px={2}>
            {permissions.length > 0 ? (
              permissions
                .reduce((acc, permission) => {
                  const categoryExists = acc.find(
                    (cat) => cat.category === permission.category,
                  );
                  if (!categoryExists) {
                    acc.push({ category: permission.category, items: [] });
                  }
                  acc
                    .find((cat) => cat.category === permission.category)
                    ?.items.push(permission);
                  return acc;
                }, [])
                .map((group, index) => (
                  <Box key={index} mb={4} width="100%">
                    <b>{group?.category}</b>
                    <div className="flex flex-row flex-wrap gap-4">
                      {group?.items?.map((permission) => (
                        <Grid key={permission?.id} item xs={12}>
                          <Checkbox checked={true} disabled color="primary" />
                          <Typography component="span">
                            {permission?.label}
                          </Typography>
                        </Grid>
                      ))}
                    </div>
                  </Box>
                ))
            ) : (
              <span>Não possui permissões habilitadas</span>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="ghost" onClick={onClose}>
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalViewRole;
