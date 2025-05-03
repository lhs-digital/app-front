import { CalendarToday, Person } from "@mui/icons-material";
import { Card, CardContent, Chip, Divider } from "@mui/material";
// import { useUserState } from "../../hooks/useUserState";

const TaskCard = ({ assignment, setSelectedAssignment }) => {
  // const { isLighthouse } = useUserState().state;

  const handleCardClick = () => {
    setSelectedAssignment(assignment);
  };

  const statusInfo = {
    not_started: {
      label: "Não iniciado",
      severity: "info",
    },
    in_progress: {
      label: "Em andamento",
      severity: "warning",
    },
    completed: {
      label: "Concluído",
      severity: "success",
    },
    overdue: {
      label: "Atrasado",
      severity: "error",
    },
  };

  return (
    <Card
      variant="outlined"
      sx={{
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        position: "relative",
        mb: 2,
      }}
      onClick={handleCardClick}
    >
      <CardContent className="flex flex-col gap-4">
        <p className="text-lg font-medium">{assignment.description}</p>
        <Divider />
        <div className="flex items-center gap-4">
          <Person fontSize="small" />
          <p>{assignment.assigned_to.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <CalendarToday fontSize="small" />
          <p>{new Date(assignment.deadline).toLocaleDateString("pt-Br")}</p>
        </div>
        <Divider />
        <Chip
          label={statusInfo[assignment.status].label}
          color={statusInfo[assignment.status].severity}
          variant="outlined"
          size="small"
        />
      </CardContent>
    </Card>
  );
};

export default TaskCard;
