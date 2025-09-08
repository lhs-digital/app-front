import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate, Outlet } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";

const PublicRoute = () => {
  const isAuthenticated = useIsAuthenticated();
  const { company } = useCompany();

  if (isAuthenticated && company) {
    return <Navigate to="/painel" />;
  }

  return <Outlet />;
};

export default PublicRoute;
