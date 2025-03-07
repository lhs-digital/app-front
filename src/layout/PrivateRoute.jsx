import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({
  // allowedRoles = [],
  allowedPermissions = [],
  ...rest
}) => {
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  const hasPermissionAccess =
    allowedPermissions.length === 0 ||
    auth.permissions.some((permission) =>
      allowedPermissions.includes(permission.name),
    );

  // const hasRoleAccess =
  //   allowedRoles.length === 0 || allowedRoles.includes(auth.user.role?.name);

  const hasAccess = isAuthenticated && hasPermissionAccess;

  if (!hasAccess) {
    return <Navigate to="/" />;
  }

  return <Outlet {...rest} />;
};

export default PrivateRoute;
