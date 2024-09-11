import { useState, createContext, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState([]);

    // Carrega o usuário e permissões salvas no localStorage quando o AuthProvider é montado
    useEffect(() => {
        const storagedUser = localStorage.getItem('user');
        const storagedPermissions = localStorage.getItem('permissions');
        const storagedToken = localStorage.getItem('token');

        if (storagedToken && storagedUser) {
            setUser(JSON.parse(storagedUser));
            setPermissions(JSON.parse(storagedPermissions) || []);
        }
    }, []);

    const signIn = async (email, password, rememberMe) => {
        try {
            const response = await api.post(`/login`, { email, password });
            const token = response.data;

            if (rememberMe) {
                localStorage.setItem("token", token.token);
                localStorage.setItem("rememberMe", rememberMe);

                const expiresAt = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
                localStorage.setItem("expiresAt", expiresAt);
            } else {
                localStorage.setItem("token", token.token);
            }

            // Salva os dados do usuário no estado e no localStorage
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));

            // Busca e salva as permissões do usuário
            const permissionsResponse = await api.get(`/me/permissions`);
            setPermissions(permissionsResponse.data.data);
            localStorage.setItem('permissions', JSON.stringify(permissionsResponse.data.data));

            return response.data;
        } catch (error) {
            console.error("Login falhou:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post(`/logout`);
        } catch (error) {
            console.error("Logout falhou:", error);
        } finally {
            // Remove todos os dados do localStorage e reseta os estados
            localStorage.removeItem("token");
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("expiresAt");
            localStorage.removeItem("user");
            localStorage.removeItem("permissions");
            setUser(null);
            setPermissions([]);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                permissions,
                signIn,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
