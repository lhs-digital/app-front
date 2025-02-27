import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storage = localStorage.getItem("token")
      ? localStorage
      : sessionStorage;

    const storagedUser = storage.getItem("user");
    const storagedPermissions = storage.getItem("permissions");
    const storagedToken = storage.getItem("token");
    const expiresAt = storage.getItem("expiresAt");

    if (
      storagedToken &&
      storagedUser &&
      expiresAt &&
      new Date().getTime() < expiresAt
    ) {
      setUser(JSON.parse(storagedUser));
      setPermissions(JSON.parse(storagedPermissions) || []);
    } else {
      if (storagedToken) logout();
    }

    setLoading(false);
  }, []);

  const signIn = async (email, password, rememberMe) => {
    try {
      const response = await api.post(`/login`, { email, password });
      const token = response.data.token;

      const storage = rememberMe ? localStorage : sessionStorage;
      const expiresAt =
        new Date().getTime() +
        (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000);

      storage.setItem("token", token);
      storage.setItem("expiresAt", expiresAt);

      setUser(response.data);
      storage.setItem("user", JSON.stringify(response.data));

      const permissionsResponse = await api.get(`/me/permissions`);
      setPermissions(permissionsResponse.data.data);
      storage.setItem(
        "permissions",
        JSON.stringify(permissionsResponse.data.data),
      );

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
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setPermissions([]);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        isLighthouse: user?.company?.is_super_admin || false,
        permissions,
        signIn,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
