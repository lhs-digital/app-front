import { Button, Dialog, DialogContent } from "@mui/material";

const ViewTask = ({ assignment, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} title="Visualizar Tarefa">
      <DialogContent>
        <div className="p-4">
          <p>{assignment?.description}</p>
        </div>
        <div className="flex justify-end p-4">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTask;
