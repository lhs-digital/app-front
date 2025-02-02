import { Computer, DarkMode, LightMode } from "@mui/icons-material";
import { Button, ButtonGroup, useTheme } from "@mui/material";
import { useState } from "react";

const ThemeSwitcher = () => {
  const theme = useTheme();
  const [mode, setMode] = useState(theme.palette.mode);

  const handleModeChange = (value) => {
    setMode(value);
    document.documentElement.setAttribute("data-theme", value);
  };

  const options = [
    {
      icon: <Computer />,
      value: "system",
      label: "Automático",
    },
    {
      icon: <LightMode />,
      value: "light",
      label: "Claro",
    },
    {
      icon: <DarkMode />,
      value: "dark",
      label: "Escuro",
    },
  ];

  return (
    <ButtonGroup
      variant="outlined"
      size="small"
      color="primary"
      disableElevation
    >
      {options.map((option) => (
        <Button
          className="aspect-square"
          key={option.value}
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
