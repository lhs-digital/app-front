import { Computer, DarkMode, LightMode } from "@mui/icons-material";
import { Button, ButtonGroup } from "@mui/material";
import { useThemeMode } from "../../contexts/themeModeContext";

const ThemeSwitcher = () => {
  const { mode, setMode } = useThemeMode();

  const handleModeChange = (value) => {
    setMode(value);
  };

  const options = [
    {
      icon: <Computer fontSize="small" />,
      value: "system",
      label: "Automático",
    },
    {
      icon: <LightMode fontSize="small" />,
      value: "light",
      label: "Claro",
    },
    {
      icon: <DarkMode fontSize="small" />,
      value: "dark",
      label: "Escuro",
    },
  ];

  return (
    <ButtonGroup
      variant="outlined"
      size="small"
      color="default"
      disableElevation
    >
      {options.map((option) => (
        <Button
          className="aspect-square"
          key={option.value}
          color={mode === option.value ? "primary" : "info"}
          variant={mode === option.value ? "contained" : "outlined"}
          onClick={() => handleModeChange(option.value)}
        >
          {option.icon}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ThemeSwitcher;
