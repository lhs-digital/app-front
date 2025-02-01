import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  TextField,
} from "@mui/material";

const ModalView = ({ selectedUser, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{selectedUser?.name}</DialogTitle>
      <DialogContent className="w-[480px] flex flex-col gap-4">
        <div>
          <InputLabel htmlFor="name">Nome</InputLabel>
          <TextField
            id="name"
            value={selectedUser?.name}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: true }}
          />
        </div>
        <div>
          <InputLabel htmlFor="email">Email</InputLabel>
          <TextField
            id="email"
            value={selectedUser?.email}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: true }}
          />
        </div>
        <div>
          <InputLabel htmlFor="role">Role</InputLabel>
          <TextField
            id="role"
            value={selectedUser?.role?.name}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: true }}
          />
        </div>
        <div>
          <InputLabel htmlFor="company">Empresa</InputLabel>
          <TextField
            id="company"
            value={selectedUser?.company?.name}
            fullWidth
            margin="dense"
            InputProps={{ readOnly: true }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Voltar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalView;
