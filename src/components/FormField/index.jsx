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
      <div className="flex flex-row gap-2 items-start">
        <InputLabel
          {...props}
          className={`mb-1 ${error ? "text-red-500" : ""}`}
          required={required}
        >
          {label}
        </InputLabel>
        {info && <Info description={info} />}
      </div>
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
