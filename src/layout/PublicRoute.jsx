import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? <Navigate to="/painel" /> : <Outlet />;
};

export default PublicRoute;
