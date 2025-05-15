import { CircularProgress } from "@mui/material";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate, Outlet } from "react-router-dom";
import { useUserState } from "../../hooks/useUserState";
import Layout from "../../layout/";

const PrivateRoute = ({ allowedPermissions = [], ...rest }) => {
  const isAuthenticated = useIsAuthenticated();
  const { state, userStateIsFetching } = useUserState();

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
