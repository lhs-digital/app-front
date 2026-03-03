import { Box, InputLabel, Skeleton } from "@mui/material";
import Info from "../Miscellaneous/Info";

const FormField = ({
  children,
  label,
  containerClass,
  loading,
  required,
  info,
  error,
  ...props
}) => {
  return (
    <Box className={containerClass}>
      <Box
        display="flex"
        flexDirection="row"
        gap="2"
        alignItems="start"
        justifyContent="space-between"
      >
        <InputLabel
          {...props}
          className={`mb-1 ${error ? "text-red-500" : ""}`}
          required={required}
        >
          {label}
        </InputLabel>
        {info && <Info description={info} />}
      </Box>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={46}
          className="rounded-md"
        />
      ) : (
        children
      )}
    </Box>
  );
};

export default FormField;
