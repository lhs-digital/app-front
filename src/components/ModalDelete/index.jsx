import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ModalDelete = ({
  isOpen,
  isRuleUnic,
  isRuleAll,
  onClose,
  onConfirm,
  message,
}) => {
  let content;
  if (message) {
    content = <p>{message}</p>;
  } else if (isRuleUnic) {
    content = <p>Você tem certeza que deseja remover esta regra?</p>;
  } else if (isRuleAll) {
    content = <p>Você tem certeza que deseja remover todas as regras?</p>;
  } else {
    content = <p>Você tem certeza que deseja excluir este item?</p>;
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {isRuleUnic
          ? "Remoção de regra adicionada"
          : isRuleAll
          ? "Remoção de todas as regras adicionadas"
          : "Excluir item?"}
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" onClick={onConfirm}>
          {isRuleUnic || isRuleAll ? "REMOVER" : "EXCLUIR"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDelete;