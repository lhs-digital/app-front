import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Navigate } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";
import { useUserState } from "../../hooks/useUserState";
import Layout from "../../layout";
import HomePage from "../../modules/base/Home";
import SignIn from "../../modules/public/SignIn";

const HomeRoute = () => {
  const isAuthenticated = useIsAuthenticated();
  const { company } = useCompany();
  const { state } = useUserState();

  if (!isAuthenticated) {
    return <SignIn />;
  }

  if (!company && !state?.isLighthouse) {
    return <Navigate to="/selecionar-empresa" replace />;
  }

  return (
    <Layout>
      <HomePage />
    </Layout>
  );
};

export default HomeRoute;
