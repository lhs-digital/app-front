import {
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";

const TaskCard = ({ assignment, setSelectedAssignment }) => {
  // Format deadline date
  const deadlineDate = new Date(assignment.deadline);
  const formattedDeadline = deadlineDate.toLocaleDateString("pt-BR");

  // Check if deadline is approaching (within 3 days)
  const isDeadlineApproaching = () => {
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    const today = new Date();
    return deadlineDate < today;
  };

  // Get color based on deadline status
  const getDeadlineColor = () => {
    if (isDeadlinePassed()) return "error";
    if (isDeadlineApproaching()) return "warning";
    return "default";
  };

  // Get first letters of assigned person for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
      {/* Type label at the top */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bgcolor: "primary.main",
          color: "white",
          px: 1,
          py: 0.5,
          borderBottomRightRadius: 8,
        }}
      >
        <Typography variant="caption" fontWeight="bold">
          {assignment.entity_type}
        </Typography>
      </Box>

      <CardContent sx={{ pt: 4 }}>
        {/* Description */}
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          <DescriptionIcon
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary", mt: 0.5 }}
          />
          <Typography
            variant="body1"
            fontWeight="medium"
            sx={{ wordBreak: "break-word" }}
          >
            {assignment.description}
          </Typography>
        </Box>

        {/* Company */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <BusinessIcon
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary" }}
          />
          <Typography variant="body2" color="text.secondary">
            {assignment.company.name}
          </Typography>
        </Box>

        {/* Deadline with color indicator */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AccessTimeIcon
            fontSize="small"
            sx={{ mr: 1, color: getDeadlineColor() + ".main" }}
          />
          <Chip
            label={`Prazo: ${formattedDeadline}`}
            size="small"
            color={getDeadlineColor()}
            variant={isDeadlinePassed() ? "filled" : "outlined"}
          />
        </Box>

        {/* Footer with assigned person */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Tooltip title={`Atribuído para: ${assignment.assigned_to.name}`}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "secondary.main",
                fontSize: "0.875rem",
              }}
            >
              {getInitials(assignment.assigned_to.name)}
            </Avatar>
          </Tooltip>
          <Tooltip title={`Atribuído por: ${assignment.assigned_by.name}`}>
            <Typography variant="caption" color="text.secondary">
              Por: {assignment.assigned_by.name}
            </Typography>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
