import { Box, InputLabel } from "@mui/material";

const FormField = ({ children, label, containerClass, ...props }) => {
  return (
    <Box className={containerClass}>
      <InputLabel {...props}>{label}</InputLabel>
      {children}
    </Box>
  );
};

export default FormField;
