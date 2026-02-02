import { Card, CardContent } from "@mui/material";
import WorkOrderForm from "../../../../components/WorkOrderForm";
import { useNavigate } from "react-router-dom";

const TaskCard = ({ assignment, onClick }) => {

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
      onClick={onClick}
    >
      <CardContent className="flex flex-col gap-4">
        <WorkOrderForm assignment={assignment} />
      </CardContent>
    </Card>
  );
};

export default TaskCard;
