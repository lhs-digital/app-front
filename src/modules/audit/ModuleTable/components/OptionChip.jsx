import { Chip, Tooltip } from "@mui/material";

const OptionChip = ({ option, onDelete }) => {
  const handleLabel = () => {
    if (!option) return null;
    return `${option.label} (${option.value})`;
  };

  return (
    <Tooltip
      placement="top"
      arrow
      title={
        <div className="flex flex-col gap-1 text-sm">
          <p>
            Label: <span className="font-bold">{option.label}</span>
          </p>
          <p>
            Value: <span className="font-bold">{option.value}</span>
          </p>
        </div>
      }
    >
      <Chip
        label={handleLabel()}
        onDelete={onDelete}
        clickable
        variant="outlined" // preto e branco
      />
    </Tooltip>
  );
};

export default OptionChip;
