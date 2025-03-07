import { CircularProgress } from "@mui/material";

const LoadingScreen = () => {
  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <CircularProgress />
    </div>
  );
};

export default LoadingScreen;
