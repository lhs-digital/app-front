import { Fragment, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../contexts/auth";
import Layout from "../layout";
import Clients from "../pages/Clients";
import Companies from "../pages/Companies";
import FirstAccess from "../pages/FirstAccess";
import Home from "../pages/Home";
import ListActivities from "../pages/ListActivities";
import Logs from "../pages/Logs";
import MyPermissions from "../pages/MyPermissions";
import PasswordUpdate from "../pages/PasswordUpdate";
import Priorities from "../pages/Priorities";
import RecoverPassword from "../pages/RecoverPassword";
import ReportsAud from "../pages/ReportsAud";
import Roles from "../pages/Roles";
import SignIn from "../pages/SignIn";
import Users from "../pages/Users";

const Private = ({ Item, allowedRoles = [], allowedPermissions = [] }) => {
  const { signed, user, permissions, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!signed || !user) {
    return <Navigate to="/" />;
  }

  const hasPermissionAccess =
    allowedPermissions.length === 0 ||
    permissions.some((permission) =>
      allowedPermissions.includes(permission.name),
    );

  //eslint-disable-next-line
  const hasRoleAccess =
    allowedRoles.length === 0 || allowedRoles.includes(user.role?.name);

  const hasAccess = signed && hasPermissionAccess;

  return hasAccess ? (
    <Layout>
      <Item />
    </Layout>
  ) : (
    <Navigate to="/" />
  );
};

const Public = ({ Item }) => {
  const { signed } = useContext(AuthContext);

  return signed ? <Navigate to="/dashboard" /> : <Item />;
};

const RoutesApp = () => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Fragment>
        <Routes>
          <Route path="/" element={<Public Item={SignIn} />} />
          <Route
            path="/recover-password"
            element={<Public Item={RecoverPassword} />}
          />
          <Route
            path="/password-update/:token"
            element={<Public Item={PasswordUpdate} />}
          />
          <Route
            path="/first-access/:token"
            element={
              <Public
                Item={FirstAccess}
                allowedRoles={["super-admin"]}
                allowedPermissions={["view_any_tasks", "update_tasks"]}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Private Item={Home} allowedRoles={["super-admin"]} />}
          />
          <Route
            exact
            path="/audits"
            element={
              <Private Item={ListActivities} allowedRoles={["super-admin"]} />
            }
          />
          <Route
            path="/prioridades"
            element={
              <Private
                Item={Priorities}
                allowedRoles={["super-admin"]}
                allowedPermissions={["define_rules"]}
              />
            }
          />
          <Route
            path="/relatorios"
            element={
              <Private
                Item={ReportsAud}
                allowedRoles={["super-admin"]}
                allowedPermissions={["view_any_reports", "report_generate"]}
              />
            }
          />

          <Route
            path="/clientes"
            element={<Private Item={Clients} allowedRoles={["super-admin"]} />}
          />

          <Route
            path="/users"
            element={
              <Private
                Item={Users}
                allowedRoles={["super-admin"]}
                allowedPermissions={[
                  "view_any_users",
                  "view_users",
                  "create_users",
                  "delete_users",
                  "update_users",
                ]}
              />
            }
          />
          <Route
            path="/companies"
            element={
              <Private
                Item={Companies}
                allowedRoles={["super-admin"]}
                allowedPermissions={[
                  "view_any_companies",
                  "view_companies",
                  "create_companies",
                  "delete_companies",
                  "update_companies",
                ]}
              />
            }
          />
          <Route
            path="/roles"
            element={
              <Private
                Item={Roles}
                allowedRoles={["super-admin"]}
                allowedPermissions={[
                  "view_any_roles",
                  "view_roles",
                  "create_roles",
                  "delete_roles",
                  "update_roles",
                ]}
              />
            }
          />
          <Route
            path="/my-permissions"
            element={
              <Private Item={MyPermissions} allowedRoles={["super-admin"]} />
            }
          />
          <Route
            path="/logs"
            element={
              <Private
                Item={Logs}
                allowedRoles={["super-admin"]}
                allowedPermissions={["view_any_logs"]}
              />
            }
          />
          <Route path="/layout" element={<Layout to="/dashboard" />} />
          {/* 404 */}
          <Route
            path="*"
            element={
              signed ? <Navigate to="/dashboard" /> : <Navigate to="/" />
            }
          />
        </Routes>
      </Fragment>
      <ToastContainer position="top-right" stacked />
    </>
  );
};

export default RoutesApp;
