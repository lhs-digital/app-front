import { Add, Assignment } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { Button, CircularProgress } from "@mui/material";
import { useCallback, useState } from "react";
import { useCompany } from "../../../hooks/useCompany";
import { useUserState } from "../../../hooks/useUserState";
import PageTitle from "../../../layout/components/PageTitle";
import { hasPermission } from "../../../services/utils";
import CreateTask from "./components/CreateTask";
import TaskCard from "./components/TaskCard";
import TaskFilter from "./components/TaskFilter";
import ViewTask from "./components/ViewTask";
import { assignmentsMock } from "./assignment_mock";
import { useNavigate } from "react-router-dom";

const WorkOrder = () => {
  const user = useUserState().state;
  const { company } = useCompany();
  const showContent = user.isLighthouse ? !!company : true;
  const [assignments, setAssignments] = useState(assignmentsMock);
  const [isFetching, setIsFetching] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const navigate = useNavigate();

  const handleSetAssignments = useCallback((newAssignments) => {
    console.log("Atualizando assignments:", newAssignments);
    setAssignments(newAssignments);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Ordens de Serviço"
        subtitle="Gerencie as ordens de serviço atribuídas a você ou à sua equipe."
        icon={<Assignment />}
        buttons={[
          hasPermission(user.permissions, "create_work_orders") && (
            <Button
              key="add-task"
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateOpen(true)}
              disabled={!showContent}
            >
              ATRIBUIR
            </Button>
          ),
        ]}
      />
      <TaskFilter
        setAssignments={handleSetAssignments}
        setIsFetching={setIsFetching}
      />
      {isFetching ? (
        <div className="col-span-full flex justify-center items-center h-32 lg:h-64">
          <CircularProgress size="1.5rem" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="col-span-full flex justify-center items-center h-32 text-neutral-500">
          {showContent
            ? "Nenhuma ordem de serviço encontrada"
            : "Selecione uma empresa para visualizar as ordens de serviço"}
        </div>
      ) : (
        <Masonry
          columns={{
            xs: 1,
            sm: 2,
            lg: 3,
            xl: 4,
          }}
          spacing={2}
          width="100%"
        >
          {assignments.map((assignment) => (
            <TaskCard
              key={assignment.id}
              assignment={assignment}
              onClick={() =>
                navigate(`/ordens-de-servico/${assignment?.id}`)
              }
            />
          ))}
        </Masonry>
      )}
      <CreateTask open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
};

export default WorkOrder;
