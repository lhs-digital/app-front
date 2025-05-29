import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/");
  }, 1000);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Até mais!</h1>
      <CircularProgress className="ml-4" />
    </div>
  );
};

export default Logout;
