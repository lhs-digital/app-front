import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const UserStateContext = createContext({
  userState: {
    permissions: [],
  },
  refetchUserState: () => {},
  userStateIsFetching: false,
});

export const UserStateProvider = ({ children }) => {
  const { user } = useAuthUser();
  const [userStateIsFetching, setUserStateIsFetching] = useState(true);
  const [userState, setUserState] = useState({
    permissions: user.permissions,
  });

  const fetchUserState = async () => {
    const permissions = await api
      .get("/me/permissions")
      .then((response) => {
        return response.data.data;
      })
      .catch((error) => {
        console.error("Erro ao buscar estado do usuário:", error);
        return {};
      });

    setUserStateIsFetching(false);
    setUserState({
      permissions: permissions,
    });
  };

  const refetchUserState = () => {
    fetchUserState();
  };

  useEffect(() => {
    fetchUserState();
    const interval = setInterval(fetchUserState, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <UserStateContext.Provider
      value={{ userState, refetchUserState, userStateIsFetching }}
    >
      {children}
    </UserStateContext.Provider>
  );
};
