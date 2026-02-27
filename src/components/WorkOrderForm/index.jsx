import {
  BusinessCenterOutlined,
  CalendarTodayOutlined,
  CheckCircleOutline,
  BuildOutlined,
  HowToRegOutlined,
  LabelOutlined,
  PersonOutline,
  HourglassEmptyOutlined,
} from "@mui/icons-material";
import { Chip, Divider, Tooltip, Typography } from "@mui/material";
import { statusInfo } from "../../modules/base/WorkOrder/utils";

const WorkOrderForm = ({ assignment, compact = false }) => {

  const isCompleted = assignment?.is_completed === true;
  const isCorrected = Boolean(assignment?.corrected_at);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "--";

  return (
    <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4"}`}>
      <div className="flex justify-between">
        <strong>OS{String(assignment?.id).padStart(4, '0')}</strong>
      </div>
      <Divider />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Tooltip title="Atribuido para" arrow>

            <PersonOutline fontSize="small" />
          </Tooltip>
          <p>{assignment?.assigned_to?.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <Tooltip title="Quantidade de vezes que foi reaberta" arrow>
            <Chip
              label={assignment?.reopen_count}
              color={assignment?.is_persistent_error ? "error" : "default"}
              size="small"
            />
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Tooltip title="Empresa" arrow>
          <BusinessCenterOutlined fontSize="small" />
        </Tooltip>
        <p>{assignment?.company?.name}</p>
      </div>


      <div className="flex items-center gap-4">
        <Tooltip title="Status" arrow>
          <LabelOutlined fontSize="small" />
        </Tooltip>
        <Chip
          label={statusInfo[assignment?.status]?.label}
          color={statusInfo[assignment?.status]?.severity}
          size="small"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
          <Tooltip title="Prazo da Ordem de Serviço" arrow>
            <CalendarTodayOutlined fontSize="small" color="warning" />
          </Tooltip>
          <p>{formatDate(assignment?.deadline)}</p>
        </div>

        {isCompleted && !isCorrected && (
          <div className="flex items-center gap-2">
            <Tooltip title="Concluída" arrow>
              <HourglassEmptyOutlined fontSize="small" color="info" />
            </Tooltip>
            <p>{formatDate(assignment?.completed_at)}</p>
          </div>
        )}

        {isCorrected && (
          <div className="flex items-center gap-2">
            <Tooltip title="Ordem de Serviço Corrigida em" arrow>
              <CheckCircleOutline fontSize="small" color="success" />
            </Tooltip>
            <p>{formatDate(assignment?.corrected_at)}</p>
          </div>
        )}
      </div>

    </div >
  );
};

export default WorkOrderForm;
