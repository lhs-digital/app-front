import { Add, ContentPaste } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import PageTitle from "../../components/PageTitle";
import { useCompany } from "../../hooks/useCompany";
import { useUserState } from "../../hooks/useUserState";
import CreateTask from "./CreateTask";
import TaskCard from "./TaskCard";
import TaskFilter from "./TaskFilter";
import ViewTask from "./ViewTask";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const user = useUserState().state;
  const { company } = useCompany();

  const showContent = user.isLighthouse ? !!company : true;

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Ordens de serviço"
        icon={<ContentPaste />}
        buttons={[
          <Button
            key="add-task"
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateOpen(true)}
            disabled={!showContent}
          >
            ATRIBUIR
          </Button>,
        ]}
      />
      <TaskFilter
        setAssignments={setAssignments}
        isFetching={isFetching}
        setIsFetching={setIsFetching}
      />
      {isFetching ? (
        <div className="col-span-full flex justify-center items-center h-32 lg:h-64">
          <CircularProgress size="1.5rem" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="col-span-full flex justify-center items-center h-32 text-gray-500">
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
              setSelectedAssignment={setSelectedAssignment}
            />
          ))}
        </Masonry>
      )}
      <CreateTask open={createOpen} onClose={() => setCreateOpen(false)} />
      <ViewTask
        open={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        assignment={selectedAssignment}
      />
    </div>
  );
};

export default Assignments;
