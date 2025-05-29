import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate, Outlet } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";

const PublicRoute = () => {
  const isAuthenticated = useIsAuthenticated();
  const { company } = useCompany();

  console.log("PublicRoute isAuthenticated:", isAuthenticated);
  console.log("PublicRoute company:", company);

  if (isAuthenticated && company) {
    return <Navigate to="/painel" />;
  }

  return <Outlet />;
};

export default PublicRoute;
