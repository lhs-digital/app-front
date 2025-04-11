import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ModalDelete = ({
  isOpen,
  onClose,
  onConfirm,
  content = <p> Você tem certeza que deseja excluir este item?</p>,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Excluir item?</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button color="error" onClick={onConfirm}>
          EXCLUIR
        </Button>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelete;
