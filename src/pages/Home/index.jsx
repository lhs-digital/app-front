import { Box, colors } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useContext } from "react";
import { Pie } from "react-chartjs-2";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";

ChartJS.register(ArcElement, Tooltip, Legend);

export const completionData = {
  labels: ["Erros Pendentes", "Erros Corrigidos"],
  datasets: [
    {
      label: "Clientes",
      data: [10, 20],
      backgroundColor: [colors.orange[400], colors.lightGreen[400]],
    },
  ],
};

export const priorityData = {
  labels: ["Baixa", "Média", "Urgente"],
  datasets: [
    {
      label: "Prioridades",
      data: [10, 40, 20],
      backgroundColor: [
        colors.grey[400],
        colors.deepOrange[300],
        colors.red[400],
      ],
    },
  ],
};

const Home = () => {
  const { user } = useContext(AuthContext).user;
  console.log(user);

  return (
    <div className="flex flex-col">
      <PageTitle title="Home" />
      <h2>
        Bem vindo, <b>{user.name}</b>.
      </h2>
      <Box display={{ xs: "block", md: "flex" }} gap={2}>
        <Box flexBasis="25%">
          <Pie data={completionData} />
        </Box>
        <Box flexBasis="25%">
          <Pie data={priorityData} />
        </Box>
      </Box>
    </div>
  );
};

export default Home;
