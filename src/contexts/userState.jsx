import { createContext, useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import api from "../services/api";

export const UserStateContext = createContext({
  userState: {
    permissions: [],
  },
  refetchUserState: () => {},
  userStateIsFetching: false,
});

export const UserStateProvider = ({ children }) => {
  const user = useAuthUser();
  const [userStateIsFetching, setUserStateIsFetching] = useState(true);
  const [userState, setUserState] = useState(user);

  const fetchUserState = async () => {
    if (!user) return;

    setUserStateIsFetching(true);

    try {
      const response = await api.get("/me/permissions");
      setUserState({
        ...user,
        permissions: response.data.data,
      });
    } catch (error) {
      console.error(error);
    }
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
