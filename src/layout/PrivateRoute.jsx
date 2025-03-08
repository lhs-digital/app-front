import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate, Outlet } from "react-router-dom";
import Layout from ".";
import { useUserState } from "../hooks/useUserState";

const PrivateRoute = ({ allowedPermissions = [], ...rest }) => {
  const isAuthenticated = useIsAuthenticated();
  const { permissions } = useUserState().userState;

  const hasPermissionAccess =
    allowedPermissions.length === 0 ||
    permissions.some((permission) =>
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
