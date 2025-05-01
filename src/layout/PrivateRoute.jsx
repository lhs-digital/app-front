import { CircularProgress } from "@mui/material";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Layout from ".";
import { useUserState } from "../hooks/useUserState";
import { superPaths } from "../routes/routes";

const PrivateRoute = ({ allowedPermissions = [], ...rest }) => {
  const isAuthenticated = useIsAuthenticated();
  const { state, userStateIsFetching } = useUserState();
  const location = useLocation();

  if (!superPaths.includes(location.pathname) && state?.isLighthouse) {
    return <Navigate to="/" />;
  }

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

  const hasAccess = isAuthenticated && hasPermissionAccess;

  if (!hasAccess) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <Outlet {...rest} />
    </Layout>
  );
};

export default PrivateRoute;
