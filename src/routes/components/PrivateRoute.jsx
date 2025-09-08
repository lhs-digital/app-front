import { CircularProgress } from "@mui/material";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";
import { useUserState } from "../../hooks/useUserState";
import Layout from "../../layout/";
import { routePermissions } from "../modules";

const PrivateRoute = () => {
  const location = useLocation();
  const allowedPermissions = routePermissions(location.pathname);
  const isAuthenticated = useIsAuthenticated();
  const { state, userStateIsFetching } = useUserState();
  const { company } = useCompany();

  if (!state && userStateIsFetching) {
    return (
      <div className="w-full h-[100vh] flex flex-col items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  const hasPermissionAccess =
    allowedPermissions.length === 0 ||
    state.permissions.some((permission) =>
      allowedPermissions.includes(permission.name),
    );

  if (!isAuthenticated || !hasPermissionAccess) {
    return <Navigate to="/" />;
  }

  if (!company) {
    return <Navigate to="/selecionar-empresa" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;
