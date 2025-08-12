import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import jsonLogic from "json-logic-js";
import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import FormField from "../FormField";
import NumberInput from "./NumberInput";

const sizes = {
  small: "col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2",
  medium: "col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-4",
  large: "col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-6",
  grow: "col-span-12 sm:grow",
  full: "col-span-12",
};

const GenericInput = ({
  type = "text", //Type of input, e.g., text, number, email, etc.
  name = "", //Name of the input field
  label = "", //Label for the input field
  placeholder = "", //Placeholder text for the input field
  value = "", //Value of the input field
  onChange = () => {}, //Function to handle changes in the input field
  onBlur = () => {}, //Function to handle blur event
  onFocus = () => {}, //Function to handle focus event
  error = false, //Boolean to indicate if there is an error
  helperText = "", //Helper text to display below the input field
  disabled = false, //Boolean to indicate if the input is disabled
  required = false, //Boolean to indicate if the input is required
  size = "grow", //Size of the input field
  condition = null, //Condition to render the input field
  options = [], //Options for select input type
  readOnly = false, //Boolean to indicate if the input is read-only
}) => {
  const { register, watch, control } = useFormContext();
  const formValues = watch();
  const dynamicLabel =
    typeof label === "object" ? jsonLogic.apply(label, formValues) : label;
  const inputProps = {
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    disabled,
    required,
    readOnly,
  };

  if (jsonLogic.apply(condition, formValues) === false) {
    return null;
  }

  if (type === "checkbox") {
    return (
      <FormField
        label={dynamicLabel}
        htmlFor={name}
        error={error}
        helperText={helperText}
        containerClass={sizes[size] || sizes.medium}
      >
        <FormControlLabel
          control={
            <Checkbox
              {...inputProps}
              {...register(name)}
              checked={watch(name) || false}
            />
          }
          label={dynamicLabel}
        />
        {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </FormField>
    );
  }

  if (type === "radio") {
    return (
      <FormField
        label={dynamicLabel}
        htmlFor={name}
        error={error}
        helperText={helperText}
        containerClass={sizes[size] || sizes.medium}
      >
        <RadioGroup
          {...inputProps}
          {...register(name)}
          value={watch(name) || ""}
        >
          {options &&
            options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={
                  typeof option.label === "object"
                    ? jsonLogic.apply(option.label, formValues)
                    : option.label
                }
              />
            ))}
        </RadioGroup>
        {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </FormField>
    );
  }

  if (type === "file") {
    return (
      <FormField
        label={dynamicLabel}
        htmlFor={name}
        error={error}
        helperText={helperText}
        containerClass={sizes[size] || sizes.medium}
      >
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <input
                type="file"
                onChange={(e) => onChange(e.target.files[0])}
                style={{ display: "none" }}
                id={name}
              />
              <label htmlFor={name}>
                <Button variant="contained" component="span">
                  Selecionar arquivo
                </Button>
              </label>
              {value && <span>{value.name}</span>}
            </>
          )}
        />

        {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </FormField>
    );
  }

  if (type === "combobox") {
    return (
      <FormField
        label={dynamicLabel}
        htmlFor={name}
        error={error}
        helperText={helperText}
        containerClass={sizes[size] || sizes.medium}
      >
        <Autocomplete
          {...inputProps}
          options={options}
          getOptionLabel={(option) =>
            typeof option.label === "object"
              ? jsonLogic.apply(option.label, formValues)
              : option.label
          }
          value={options.find((option) => option.value === watch(name)) || null}
          onChange={(event, newValue) => {
            const simulatedEvent = {
              target: {
                name,
                value: newValue ? newValue.value : "",
              },
            };
            onChange(simulatedEvent);
            register(name).onChange(simulatedEvent);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              {...register(name, {
                required: required ? `${label} é obrigatório` : false,
              })}
              error={error}
              helperText={helperText}
            />
          )}
        />
      </FormField>
    );
  }

  if (type === "select") {
    return (
      <FormField
        label={dynamicLabel}
        htmlFor={name}
        error={error}
        helperText={helperText}
        containerClass={sizes[size] || sizes.medium}
      >
        <>
          <Select
            {...inputProps}
            fullWidth
            value={watch(name) || ""}
            {...register(name, {
              required: required ? `${label} é obrigatório` : false,
            })}
          >
            <MenuItem value="" disabled>
              {placeholder || "Selecione uma opção"}
            </MenuItem>
            {options &&
              options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {typeof option.label === "object"
                    ? jsonLogic.apply(option.label, formValues)
                    : option.label}
                </MenuItem>
              ))}
          </Select>
          {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
        </>
      </FormField>
    );
  }

  if (type === "cpf-cnpj") {
    return (
      <FormField
        label={dynamicLabel}
        htmlFor={name}
        error={error}
        helperText={helperText}
        containerClass={sizes[size] || sizes.medium}
      >
        <TextField
          {...inputProps}
          {...register(name, {
            required: required ? `${label} é obrigatório` : false,
          })}
          fullWidth
          type="text"
        />
      </FormField>
    );
  }

  if (type === "number") {
    return (
      <FormField
        label={dynamicLabel}
        htmlFor={name}
        error={error}
        helperText={helperText}
        containerClass={sizes[size] || sizes.medium}
      >
        <Controller
          name={name}
          control={control}
          rules={{
            required: required ? `${label} é obrigatório` : false,
          }}
          render={({ field }) => (
            <NumberInput {...inputProps} {...field} fullWidth min={0} />
          )}
        />
      </FormField>
    );
  }

  return (
    <FormField
      label={dynamicLabel}
      htmlFor={name}
      error={error}
      helperText={helperText}
      containerClass={sizes[size] || sizes.medium}
    >
      <TextField
        {...inputProps}
        {...register(name, {
          required: required ? `${label} é obrigatório` : false,
        })}
        fullWidth
        type={type}
      />
    </FormField>
  );
};

GenericInput.propTypes = {
  type: PropTypes.oneOf([
    "text",
    "cpf-cnpj",
    "number",
    "email",
    "password",
    "tel",
    "url",
    "search",
    "date",
    "time",
    "select",
    "checkbox",
    "radio",
    "file",
    "combobox",
  ]),
  name: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default GenericInput;
