import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SvgIcon from "@mui/material/SvgIcon";
import React from "react";

const NumberInput = React.forwardRef(function NumberInput(props, ref) {
  const {
    value,
    onChange,
    min,
    max,
    step = 1,
    disabled = false,
    size = "medium",
    endAdornment = null,
    name,
    onBlur,
    ...other
  } = props;

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    // Allow empty string, minus sign, and valid number patterns
    if (
      inputValue === "" ||
      inputValue === "-" ||
      /^-?\d*\.?\d*$/.test(inputValue)
    ) {
      if (onChange) {
        onChange(event);
      }
    }
  };

  const handleIncrement = () => {
    if (disabled) return;

    const currentValue = parseFloat(value) || 0;
    const newValue = currentValue + step;
    const clampedValue = max !== undefined ? Math.min(newValue, max) : newValue;

    if (onChange) {
      const event = {
        target: {
          value: clampedValue.toString(),
          name,
        },
      };
      onChange(event);
    }
  };

  const handleDecrement = () => {
    if (disabled) return;

    const currentValue = parseFloat(value) || 0;
    const newValue = currentValue - step;
    const clampedValue = min !== undefined ? Math.max(newValue, min) : newValue;

    if (onChange) {
      const event = {
        target: {
          value: clampedValue.toString(),
          name,
        },
      };
      onChange(event);
    }
  };

  const canIncrement =
    !disabled && (max === undefined || parseFloat(value || 0) < max);
  const canDecrement =
    !disabled && (min === undefined || parseFloat(value || 0) > min);

  return (
    <OutlinedInput
      ref={ref}
      size={size}
      value={value || ""}
      onChange={handleInputChange}
      onBlur={onBlur}
      name={name}
      disabled={disabled}
      {...other}
      endAdornment={
        <>
          {endAdornment}
          <InputAdornment position="end">
            <Box
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                marginRight: "-0.5rem",
                "& > button": {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 4,
                  padding: "2px",
                  minWidth: "24px",
                  height: "20px",
                  "&:hover": {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.action.hover,
                  },
                  "&.Mui-disabled": {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  },
                },
              })}
            >
              <ButtonBase
                onClick={handleIncrement}
                disabled={!canIncrement}
                tabIndex={-1}
              >
                <SvgIcon fontSize="small">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
                </SvgIcon>
              </ButtonBase>
              <ButtonBase
                onClick={handleDecrement}
                disabled={!canDecrement}
                tabIndex={-1}
              >
                <SvgIcon fontSize="small">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                </SvgIcon>
              </ButtonBase>
            </Box>
          </InputAdornment>
        </>
      }
    />
  );
});

export default NumberInput;
export const FieldNumberInput = NumberInput;
