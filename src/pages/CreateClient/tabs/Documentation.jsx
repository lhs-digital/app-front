import { Box, InputLabel, TextField, IconButton } from "@mui/material";
import { useFormContext } from "react-hook-form";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { styled } from "@mui/system";
import { useState } from "react";

const FileInputWrapper = styled("div")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  "& input[type='file']": {
    position: "absolute",
    left: 0,
    top: 0,
    opacity: 0,
    width: "100%",
    height: "100%",
    cursor: "pointer",
  },
  "& .MuiInputBase-root": {
    paddingRight: "40px",
  },
  "& .file-icon": {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  "& .file-icon.selected": {
    color: "#4caf50", // Verde suave
  },
});

const Documentation = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const [fileNames, setFileNames] = useState({
    rg_cpf: "Nenhum ficheiro selecionado",
    residence_proof: "Nenhum ficheiro selecionado",
    signed_contract: "Nenhum ficheiro selecionado",
    equipment_loan: "Nenhum ficheiro selecionado",
  });

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFileNames((prev) => ({ ...prev, [fieldName]: file.name }));
      setValue(fieldName, file);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 w-full">
      <Box className="lg:col-span-4">
        <InputLabel required>RG e CPF do titular (PDF)</InputLabel>
        <FileInputWrapper>
          <TextField
            type="text"
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton className={`file-icon ${fileNames.rg_cpf !== "Nenhum ficheiro selecionado" ? "selected" : ""}`}>
                  <AttachFileIcon />
                </IconButton>
              ),
            }}
            value={fileNames.rg_cpf}
            error={!!errors.rg_cpf}
            helperText={errors.rg_cpf?.message}
          />
          <input
            type="file"
            accept="application/pdf"
            {...register("rg_cpf", { required: "RG e CPF do titular são obrigatórios" })}
            onChange={(e) => handleFileChange(e, "rg_cpf")}
          />
        </FileInputWrapper>
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Comprovante de residência atualizado (PDF)</InputLabel>
        <FileInputWrapper>
          <TextField
            type="text"
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton className={`file-icon ${fileNames.residence_proof !== "Nenhum ficheiro selecionado" ? "selected" : ""}`}>
                  <AttachFileIcon />
                </IconButton>
              ),
            }}
            value={fileNames.residence_proof}
            error={!!errors.residence_proof}
            helperText={errors.residence_proof?.message}
          />
          <input
            type="file"
            accept="application/pdf"
            {...register("residence_proof", { required: "Comprovante de residência é obrigatório" })}
            onChange={(e) => handleFileChange(e, "residence_proof")}
          />
        </FileInputWrapper>
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Contrato assinado digitalmente ou fisicamente (PDF)</InputLabel>
        <FileInputWrapper>
          <TextField
            type="text"
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton className={`file-icon ${fileNames.signed_contract !== "Nenhum ficheiro selecionado" ? "selected" : ""}`}>
                  <AttachFileIcon />
                </IconButton>
              ),
            }}
            value={fileNames.signed_contract}
            error={!!errors.signed_contract}
            helperText={errors.signed_contract?.message}
          />
          <input
            type="file"
            accept="application/pdf"
            {...register("signed_contract", { required: "Contrato assinado é obrigatório" })}
            onChange={(e) => handleFileChange(e, "signed_contract")}
          />
        </FileInputWrapper>
      </Box>
      <Box className="lg:col-span-4">
        <InputLabel required>Comodato de equipamentos, se aplicável (PDF)</InputLabel>
        <FileInputWrapper>
          <TextField
            type="text"
            fullWidth
            InputProps={{
              readOnly: true,
              endAdornment: (
                <IconButton className={`file-icon ${fileNames.equipment_loan !== "Nenhum ficheiro selecionado" ? "selected" : ""}`}>
                  <AttachFileIcon />
                </IconButton>
              ),
            }}
            value={fileNames.equipment_loan}
            error={!!errors.equipment_loan}
            helperText={errors.equipment_loan?.message}
          />
          <input
            type="file"
            accept="application/pdf"
            {...register("equipment_loan", { required: "Comodato de equipamentos é obrigatório" })}
            onChange={(e) => handleFileChange(e, "equipment_loan")}
          />
        </FileInputWrapper>
      </Box>
    </div>
  );
};

export default Documentation;