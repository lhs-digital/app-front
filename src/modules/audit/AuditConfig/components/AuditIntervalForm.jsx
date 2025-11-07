import { FormControl, MenuItem, Select } from "@mui/material";

const AuditIntervalForm = ({ interval, onChange }) => {
  return (
    <FormControl fullWidth>
      <Select value={interval || ""} onChange={(e) => onChange(e.target.value)}>
        <MenuItem value={600}>10 minutos</MenuItem>
        <MenuItem value={1800}>30 minutos</MenuItem>
        <MenuItem value={3600}>1 hora</MenuItem>
        <MenuItem value={21600}>6 horas</MenuItem>
        <MenuItem value={43200}>12 horas</MenuItem>
        <MenuItem value={86400}>1 dia</MenuItem>
        <MenuItem value={604800}>1 semana</MenuItem>
        <MenuItem value={2592000}>1 mês</MenuItem>
        <MenuItem value={31536000}>1 ano</MenuItem>
      </Select>
    </FormControl>
  );
};

export default AuditIntervalForm;
