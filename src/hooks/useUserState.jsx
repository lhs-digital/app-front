import { useContext } from "react";
import { UserStateContext } from "../contexts/userState";

export const useUserState = () => useContext(UserStateContext);
