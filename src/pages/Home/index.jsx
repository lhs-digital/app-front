import HomeIcon from "@mui/icons-material/Home";
import { Masonry } from "@mui/lab";
import { colors } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useContext, useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";
import AuditSection from "./AuditSection";
import MiscSection from "./MiscSection";

ChartJS.register(ArcElement, Tooltip, Legend);

export const completionData = {
  labels: ["Pendentes", "Corrigidos"],
  datasets: [
    {
      label: "Clientes",
      data: [10, 20],
      backgroundColor: [colors.grey[600], colors.grey[400]],
    },
  ],
};

export const priorityData = {
  labels: ["Baixa", "Média", "Urgente"],
  datasets: [
    {
      label: "Prioridades",
      data: [10, 40, 20],
      backgroundColor: [colors.grey[300], colors.grey[500], colors.grey[800]],
    },
  ],
};

const Home = () => {
  const { user } = useContext(AuthContext).user;
  console.log(user);

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
      <Masonry
        columns={{
          xs: 1,
          lg: 2,
          xl: 3,
        }}
        spacing={2}
        width="100%"
      >
        <AuditSection
          completionData={completionData}
          priorityData={priorityData}
        />
        <MiscSection
          completionData={completionData}
          priorityData={priorityData}
        />
      </Masonry>
    </div>
  );
};

export default Home;
