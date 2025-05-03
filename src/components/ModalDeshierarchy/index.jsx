import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  Chip,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { Close } from "@mui/icons-material";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../services/api";
import { toast } from "react-toastify";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { set } from "react-hook-form";

const ModalDeshierarchy = ({ isOpen, onClose, selectedUser }) => {
  const [responsibleUser, setResponsibleUser] = useState(null);
  const [associatedUsers, setAssociatedUsers] = useState([]);
  const user = useAuthUser();
  const [company, setCompany] = useState("");

  const { data: roles = [] } = useQuery({
    queryKey: ["potentialResponsibles"],
    queryFn: async () => {
      const response = await api.get("users/potential-responsibles12", {
        params: { user_id: selectedUser?.id },
      });
      return response.data;
    },
  });

  const { data: companies = [], isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await api.get("/companies/get_companies");
      return response.data?.data;
    },
    enabled: user.isLighthouse,
  });

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    rolesFromCompany(event.target.value);
  };

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/users/assign-self-responsible", {
        target_user_id: selectedUser?.id
      });

      return response.data;
    },
    onSuccess: () => {
      handleClose();
      toast.success(`Responsável ${responsibleUser?.name} atribuído com sucesso ao usuário com id: ${selectedUser?.id}!`);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Erro ao atribuir responsável. Tente novamente mais tarde.";
      toast.error(`Erro: ${errorMessage}`);
      console.error("Erro ao atribuir responsável:", error);
    },
  });

  const users = roles.length > 0 ? roles[0].users : [];

  const handleSave = () => {

    mutate();
  };

  const handleAddUser = (user) => {
    if (user && !associatedUsers.some((u) => u.id === user.id)) {
      setAssociatedUsers((prev) => [...prev, user]);
    }
  };

  const handleRemoveUser = (user) => {
    setAssociatedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleClose = () => {
    setResponsibleUser(null);
    setCompany("");
    setAssociatedUsers([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>{"Desvincular Usuários"}</DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        {selectedUser ? (
          <Box>
            <p>Você deseja se tornar responsável por este usuário?</p>
            <br></br>
            <p>Nome: {selectedUser?.name}</p>
            <p>Email: {selectedUser?.email}</p>
            <p>Cargo: {selectedUser?.role.name}</p>
          </Box>
        ) : (
          <>
            {user.isLighthouse && (
              <>
                <Box>
                  <InputLabel>Empresa *</InputLabel>
                  <Autocomplete
                    options={companies} 
                    getOptionLabel={(option) => option.name}
                    value={companies.find((companyItem) => companyItem.id === company) || null} 
                    onChange={(event, newValue) => {
                      setCompany(newValue?.id || ""); 
                      if (newValue) {
                        rolesFromCompany(newValue.id); 
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Selecione uma empresa" fullWidth />
                    )}
                  />
                </Box>
                <Box>
                  <InputLabel>Usuário Responsável*</InputLabel>
                  <Autocomplete
                    options={users}
                    getOptionLabel={(option) => option.name}
                    value={responsibleUser}
                    onChange={(event, newValue) => setResponsibleUser(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Selecione um usuário" fullWidth />
                    )}
                  />
                </Box>
              </>
            )}
            <Box>
              <InputLabel>Usuário Associado *</InputLabel>
              <Autocomplete
                options={users
                  .filter((user) => user.id !== responsibleUser?.id)
                  .filter((user) => !associatedUsers.some((u) => u.id === user.id))}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => handleAddUser(newValue)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Selecione um usuário" fullWidth />
                )}
              />
            </Box>
          </>
        )}
        <Box>
          {associatedUsers.map((user) => (
            <Chip
              key={user.id}
              label={user.name}
              onDelete={() => handleRemoveUser(user)}
              deleteIcon={<Close />}
              style={{ margin: "4px" }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="info" onClick={handleClose}>
          CANCELAR
        </Button>
        <Button color="primary" onClick={handleSave}>CONFIRMAR</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDeshierarchy;