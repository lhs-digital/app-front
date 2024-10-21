import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import RecoverPassword from "../pages/RecoverPassword";
import PasswordUpdate from "../pages/PasswordUpdate";
import { Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Users from "../pages/Users";
import FirstAccess from "../pages/FirstAccess";
import Companies from "../pages/Companies";
import Roles from "../pages/Roles";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import MyPermissions from "../pages/MyPermissions";
import Logs from "../pages/Logs";
import AllActivities from "../pages/AllActivities";


const Private = ({ Item, allowedRoles = [], allowedPermissions = [] }) => {
    const { signed , permissions } = useContext(AuthContext);

    // Verifica se o usuário possui uma das roles permitidas
    // const hasRoleAccess = allowedRoles.length === 0 || allowedRoles.includes(user?.user?.role?.name);

    // Verifica se o usuário possui ao menos uma das permissões permitidas
    const hasPermissionAccess = allowedPermissions.length === 0 || permissions.some(permission => allowedPermissions.includes(permission.name));

    // Verifica se o usuário está autenticado, possui uma role permitida e possui uma permissão permitida
    const hasAccess = signed && hasPermissionAccess;

    // Renderiza o componente se o usuário tiver acesso; caso contrário, redireciona para a página inicial
    return hasAccess ? <Item /> : <Navigate to="/" />;
};

const Public = ({ Item }) => {
    const { signed } = useContext(AuthContext);


    return signed ? <Navigate to="/dashboard" /> : <Item />;
};

const RoutesApp = () => {
    const { signed } = useContext(AuthContext);

    return (
        <>
            <Fragment>
                <Routes>
                    <Route path="/" element={<Public Item={SignIn} />} />
                    <Route path="/recover-password" element={<Public Item={RecoverPassword} />} />
                    <Route path="/password-update/:token" element={<Public Item={PasswordUpdate} />} />
                    <Route path="/first-access/:token" element={<Public Item={FirstAccess} />} />

                    <Route exact path="/dashboard" element={<Private Item={Home} allowedRoles={['super-admin']} />} />

                    <Route path="/atividades" element={<Private Item={AllActivities} allowedRoles={['super-admin']} />} />

                    <Route path="/users" element={<Private Item={Users} allowedRoles={['super-admin']} allowedPermissions={['view_any_users', 'view_users', 'create_users', 'delete_users', 'update_users']} />} />
                    <Route path="/companies" element={<Private Item={Companies} allowedRoles={['super-admin']} allowedPermissions={['view_any_companies', 'view_companies', 'create_companies', 'delete_companies', 'update_companies']} />} />
                    <Route path="/roles" element={<Private Item={Roles} allowedRoles={['super-admin']} allowedPermissions={['view_any_roles', 'view_roles', 'create_roles', 'delete_roles', 'update_roles']} />} />
                    <Route path="/my-permissions" element={<Private Item={MyPermissions} allowedRoles={['super-admin']} />} />
                    <Route path="/logs" element={<Private Item={Logs} allowedRoles={['super-admin']} allowedPermissions={['view_any_logs']}/>} />

                    {/* 404 */}
                    <Route path="*" element=
                        {signed ? <Navigate to="/dashboard-admin" /> : <Navigate to="/" />}
                    />
                </Routes>
            </Fragment>
            <ToastContainer
                position="top-right"
                stacked
            />
        </>
    );
}

export default RoutesApp;