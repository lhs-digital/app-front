import { Subject } from "@mui/icons-material";

const iconStyles = {
  fontSize: "small",
};

export const RouteIcon = ({ route }) => {
  const Icon = route.icon || Subject;
  const ActiveIcon = route.activeIcon || Subject;

  return {
    icon: <Icon {...iconStyles} />,
    activeIcon: <ActiveIcon {...iconStyles} />,
  };
};
