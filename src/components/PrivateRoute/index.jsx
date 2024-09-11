import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ Item, allowedRoles }) => {
    const { signed, user } = useContext(AuthContext);
    console.log(signed)

    // Verifica se o usuário está logado e se possui uma das roles permitidas
    const hasAccess = signed && roles.some(role => allowedRoles.includes(role.name));

    // Redireciona com base na verificação de acesso
    return hasAccess ? <Item /> : <Navigate to="/" />;
};

export default PrivateRoute;
