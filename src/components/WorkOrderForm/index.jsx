import {
  CalendarTodayOutlined,
  LabelOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { Chip, Divider } from "@mui/material";
import { statusInfo } from "../../modules/base/WorkOrder/utils";

const WorkOrderForm = ({ assignment, compact = false }) => {
  return (
    <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4"}`}>
      {!compact && (
        <>
          <p className="text-lg font-medium">{assignment?.description}</p>
          <Divider />
        </>
      )}
      <div className="flex items-center gap-4">
        <PersonOutline fontSize="small" />
        <p>{assignment?.assigned_to?.name}</p>
      </div>
      <div className="flex items-center gap-4">
        <CalendarTodayOutlined fontSize="small" />
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
