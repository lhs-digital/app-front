import { Build, Description, RuleFolder } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { Box, Button, Card, Divider } from "@mui/material";
import { useState } from "react";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import ModalReport from "../../components/ModalReport";

const AuditSection = ({ completionData, priorityData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Box display="flex" gap={2} flexDirection="column" width="50%">
      <div className="flex flex-row gap-2 items-center">
        <Build fontSize="small" />
        <h2 className="font-medium">Auditoria</h2>
      </div>
      <Masonry
        columns={{
          xs: 1,
          lg: 2,
        }}
        spacing={2}
        width="100%"
      >
        <Card className="p-4 flex flex-col gap-2" variant="outlined">
          <p>Relatório disponível</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsOpen(true)}
            startIcon={<Description />}
          >
            GERAR
          </Button>
        </Card>
        <Card className="p-4 flex flex-col gap-2" variant="outlined">
          <p>Regras de auditoria</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/prioridades")}
            startIcon={<RuleFolder />}
          >
            VISUALIZAR
          </Button>
        </Card>
        <Card className="p-4 flex flex-col gap-2" variant="outlined">
          <p>Entidades auditadas</p>
          <p className="text-lg lg:text-2xl font-bold">124</p>
        </Card>
        <Card className="p-4 flex flex-col gap-2" variant="outlined">
          <p>Última auditoria</p>
          <p className="text-lg lg:text-2xl font-bold">
            {new Date(Date.now()).toLocaleDateString("pt-BR")}
          </p>
        </Card>
        <Card
          variant="outlined"
          className="max-md:hidden p-4 flex flex-col gap-2"
        >
          <p>Tarefas por status</p>
          <Divider sx={{ marginBottom: 1 }} />
          <Pie
            data={completionData}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </Card>
        <Card
          variant="outlined"
          className="max-md:hidden p-4 flex flex-col gap-2"
        >
          <p>Tarefas por prioridade</p>
          <Divider sx={{ marginBottom: 1 }} />
          <Pie
            data={priorityData}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </Card>
      </Masonry>
      <ModalReport isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
};

export default AuditSection;
