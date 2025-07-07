import { Box, InputLabel, Skeleton } from "@mui/material";

const FormField = ({ children, label, containerClass, loading, ...props }) => {
  return (
    <Box className={containerClass}>
      <InputLabel {...props}>{label}</InputLabel>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={56}
          className="rounded-md"
        />
      ) : (
        children
      )}
    </Box>
  );
};

export default FormField;
