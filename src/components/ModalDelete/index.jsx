import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

const ModalDelete = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Excluir item?</DialogTitle>
      <DialogContent>
        Você tem certeza que deseja excluir este item?
      </DialogContent>
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
