import { ControlPoint } from "@mui/icons-material";
import { Box, Skeleton } from "@mui/material";

const MiscSection = () => {
  return (
    <Box display="flex" gap={2} flexDirection="column" width="50%">
      <div className="flex flex-row gap-2 items-center">
        <ControlPoint fontSize="small" />
        <h2 className="font-medium">Mais informações </h2>
      </div>
      <Skeleton width="100%" height="450px" variant="rounded" />
    </Box>
  );
};

export default MiscSection;
