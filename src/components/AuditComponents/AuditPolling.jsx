import { History } from "@mui/icons-material";
import { CircularProgress, Skeleton, Tooltip } from "@mui/material";
import AuditStatus from "./AuditStatus";

const AuditPolling = ({ latestAudit, loading = false }) => {
  const renderText = () => {
    if (latestAudit.status === "pending" && latestAudit?.executed_at) {
      return "Auditoria iniciada em " + latestAudit?.executed_at;
    }
    return latestAudit?.executed_at;
  };

  if (loading) {
    return (
      <div className="border border-[--border] rounded-xl p-2 gap-2 flex items-center">
        <Tooltip title="Detalhes da última auditoria">
          <History fontSize="small" />
        </Tooltip>
        <CircularProgress size={16} color="info" />
        <Skeleton variant="text" width={100} height={20} />
      </div>
    );
  }

  return (
    <div className="border border-[--border] rounded-xl p-2 gap-2 flex items-center">
      <Tooltip title="Detalhes da última auditoria">
        <History fontSize="small" />
      </Tooltip>
      <AuditStatus status={latestAudit?.status} />
      <p className="text-sm text-zinc-400">{renderText()}</p>
    </div>
  );
};

export default AuditPolling;
