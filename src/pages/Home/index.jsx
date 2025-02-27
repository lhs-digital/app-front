import HomeIcon from "@mui/icons-material/Home";
import { useContext, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";
import AuditSection from "./AuditSection";

export const completionData = [
  { id: 0, value: Math.floor(Math.random() * 41), label: "Pendentes" },
  { id: 1, value: Math.floor(Math.random() * 42), label: "Corrigidos" },
];

export const priorityData = [
  { id: 0, value: Math.floor(Math.random() * 41), label: "Baixa" },
  { id: 1, value: Math.floor(Math.random() * 42), label: "Média" },
  { id: 2, value: Math.floor(Math.random() * 43), label: "Urgente" },
];

export const stats = {
  audittedEntities: Math.floor(Math.random() * 100),
  latestAudit: new Date(Date.now()).toLocaleDateString("pt-BR"),
};

const Home = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    document.title = "LHS - Home";
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Dashboard"
        icon={<HomeIcon />}
        subtitle={`Bem vindo, ${user.name}`}
      />
      <AuditSection
        completionData={completionData}
        priorityData={priorityData}
        stats={stats}
      />
    </div>
  );
};

export default Home;
