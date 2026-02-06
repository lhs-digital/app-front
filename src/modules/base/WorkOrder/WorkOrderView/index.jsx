import {
  ArrowBack,
  Cancel,
  Edit,
  Save,
  WorkOutline,
} from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../layout/components/PageTitle";
import WorkOrderForm from "../../../../components/WorkOrderForm";
import { assignmentsMock } from "../assignment_mock"; // temporário

const WorkOrderView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 TEMPORÁRIO (depois vira React Query)
  const assignment = assignmentsMock.find(
    (item) => String(item.id) === String(id)
  );

  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p>Ordem de serviço não encontrada.</p>
        <Button onClick={() => navigate("/ordens-de-servico")}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageTitle
        title={`Ordem de Serviço #${String(assignment.id).padStart(4, "0")}`}
        icon={<WorkOutline />}
        subtitle={
          isEditing
            ? "Edição da Ordem de Serviço"
            : "Visualização da Ordem de Serviço"
        }
        buttons={[
          <Button
            key="back-button"
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/ordens-de-servico")}
          >
            Voltar
          </Button>,

          isEditing ? (
            <>
              <Button
                key="cancel-button"
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>

              <Button
                key="save-button"
                variant="contained"
                color="primary"
                startIcon={<Save />}
              >
                Salvar
              </Button>
            </>
          ) : (
            <Button
              key="edit-button"
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
            >
              Editar
            </Button>
          ),
        ]}
      />

      {/* 🔽 AQUI estão os elementos que você queria */}
      <WorkOrderForm assignment={assignment} />
    </div>
  );
};

export default WorkOrderView;
