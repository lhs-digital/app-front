import { useContext } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { UserStateContext } from "../contexts/userState";

export const useUserState = () => {
  const context = useContext(UserStateContext);
  const user = useAuthUser();
  if (!context) {
    return user;
  }
  return context;
};
