import { Card, CardContent } from "@mui/material";
import WorkOrderForm from "../../../../components/WorkOrderForm";
// import { useUserState } from "../../hooks/useUserState";

const TaskCard = ({ assignment, setSelectedAssignment }) => {
  // const { isLighthouse } = useUserState().state;

  const handleCardClick = () => {
    setSelectedAssignment(assignment);
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
        <WorkOrderForm assignment={assignment} />
      </CardContent>
    </Card>
  );
};

export default TaskCard;
