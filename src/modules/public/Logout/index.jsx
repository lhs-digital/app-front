import { useEffect } from "react";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Navigate } from "react-router-dom";
import { useCompany } from "../../../hooks/useCompany";

const Logout = () => {
  const signOut = useSignOut();
  const { setCompany } = useCompany();

  setCompany(null);

  useEffect(() => {
    signOut();
  }, [signOut]);

  return <Navigate to="/" />;
};

export default Logout;
