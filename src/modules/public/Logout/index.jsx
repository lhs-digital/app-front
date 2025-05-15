import { useEffect } from "react";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const signOut = useSignOut();

  useEffect(() => {
    signOut();
  }, [signOut]);

  return <Navigate to="/" />;
};

export default Logout;
