import { Box, InputLabel, Skeleton } from "@mui/material";

const FormField = ({
  children,
  label,
  containerClass,
  loading,
  required,
  ...props
}) => {
  return (
    <Box className={containerClass}>
      <InputLabel {...props} className="mb-1" required={required}>
        {label}
      </InputLabel>
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
