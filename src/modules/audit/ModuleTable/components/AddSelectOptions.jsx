import { Add } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddSelectOptions = ({ open, onClose, submit }) => {
  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      label: "",
      value: "",
    },
  });

  const onSubmit = (data) => {
    if (!data.label || !data.value) {
      toast.warn("Preencha o Label e o Value.");
      return;
    }

    submit({
      label: data.label.trim(),
      value: data.value.trim(),
    });

    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <span className="font-semibold text-lg flex items-center gap-2">
          Adicionar opção
        </span>
      </DialogTitle>

      <DialogContent>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl className="col-span-1 md:col-span-2">
            <FormLabel>Label</FormLabel>
            <TextField {...register("label")} placeholder="Ex: Nome exibido" />
            <FormHelperText>
              Texto visível que será mostrado no select.
            </FormHelperText>
          </FormControl>

          <FormControl className="col-span-1 md:col-span-2">
            <FormLabel>Value</FormLabel>
            <TextField {...register("value")} placeholder="Ex: valor_interno" />
            <FormHelperText>
              Valor que será enviado no formulário.
            </FormHelperText>
          </FormControl>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Voltar
        </Button>
        <Button
          startIcon={<Add />}
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          Adicionar opção
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSelectOptions;
