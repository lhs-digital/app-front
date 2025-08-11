import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onAccept,
  onReject,
  title = "Confirmar",
  description = "Tem certeza de que deseja prosseguir?",
  acceptLabel = "Sim",
  rejectLabel = "Não",
}) => {
  return (
    <Dialog isOpen={isOpen} onOpenChange={onClose}>
      <DialogTitle className="flex flex-col gap-1">{title}</DialogTitle>
      <DialogContent>{description}</DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => {
            if (onReject) onReject();
            close();
          }}
        >
          {rejectLabel}
        </Button>
        <Button
          color="danger"
          variant="light"
          onPress={() => {
            onAccept();
            close();
          }}
        >
          {acceptLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
