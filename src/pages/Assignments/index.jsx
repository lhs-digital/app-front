import { Add, ContentPaste } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import PageTitle from "../../components/PageTitle";
import CreateTask from "./CreateTask";
import TaskFilter from "./TaskFilter";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <PageTitle
        title="Atribuições"
        icon={<ContentPaste />}
        buttons={[
          <Button
            key="add-task"
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateOpen(true)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isFetching ? (
          <div className="col-span-full flex justify-center items-center h-32 lg:h-64">
            <CircularProgress size="1.5rem" />
          </div>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id} variant="outlined">
              <CardHeader title={assignment.entity_type} />
              <CardContent className="flex flex-col gap-2">
                <p>Descrição: {assignment.description}</p>
                <p>Empresa: {assignment.company.name}</p>
                <p>Atribuído por: {assignment.assigned_by.name}</p>
                <p>Atribuído para: {assignment.assigned_to.name}</p>
                <p>
                  Deadline:{" "}
                  {new Date(assignment.deadline).toLocaleDateString("pt-Br")}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <CreateTask open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
};

export default Assignments;
