import { CalendarToday, LabelOutlined, Person } from "@mui/icons-material";
import { Chip, Divider } from "@mui/material";
import { statusInfo } from "../../pages/Assignments/utils";

const WorkOrderForm = ({ assignment }) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-medium">{assignment?.description}</p>
      <Divider />
      <div className="flex items-center gap-4">
        <Person fontSize="small" />
        <p>{assignment?.assigned_to?.name}</p>
      </div>
      <div className="flex items-center gap-4">
        <CalendarToday fontSize="small" />
        <p>{new Date(assignment.deadline).toLocaleDateString("pt-Br")}</p>
      </div>
      <div className="flex items-center gap-4">
        <LabelOutlined fontSize="small" />
        <Chip
          label={statusInfo[assignment?.status]?.label}
          color={statusInfo[assignment?.status]?.severity}
          size="small"
        />
      </div>
    </div>
  );
};

export default WorkOrderForm;
