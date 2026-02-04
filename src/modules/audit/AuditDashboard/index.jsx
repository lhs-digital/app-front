import { Build } from "@mui/icons-material";
import { useEffect } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import PageTitle from "../../../layout/components/PageTitle";
import AuditSection from "./components/AuditSection";

const AuditDashboard = () => {
  const user = useAuthUser();

  useEffect(() => {
    document.title = "LHS - Painel de Auditoria";
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Painel de Auditoria"
        icon={<Build />}
        subtitle={`Bem vindo, ${user.name}`}
      />
      <AuditSection />
    </div>
  );
};

export default AuditDashboard;
