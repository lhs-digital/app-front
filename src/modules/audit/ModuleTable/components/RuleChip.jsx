import { Remove, TableChartOutlined } from "@mui/icons-material";
import { Card, CardContent, Chip } from "@mui/material";

const RuleChip = ({
  column,
  tableName,
  onClick,
  onDelete,
  readOnly,
  disabled,
}) => {
  const len = column.rules.length;
  return (
    <div className="relative grow">
      <Card
        onClick={onClick}
        className={`${readOnly ? "cursor-default" : "cursor-pointer border hover:border-[--foreground-color]"} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <CardContent className="flex flex-col gap-4 min-w-56">
          <div className="flex flex-col gap-1">
            <p className="font-bold">{column.label}</p>
            <p className="text-sm">
              Coluna <span>&quot;{column.name}&quot;</span>
            </p>
            {tableName && (
              <div className="flex flex-row items-center gap-1 text-sm text-neutral-500">
                <TableChartOutlined fontSize="inherit" />
                <p className="font-medium text-xs">{tableName}</p>
              </div>
            )}
          </div>
          <Chip
            size="small"
            label={
              <p>
                {len} <span>regra{len !== 1 && "s"}</span>
              </p>
            }
          />
        </CardContent>
      </Card>
      {!readOnly && (
        <div className="absolute -top-2.5 -right-2.5">
          <button
            size="small"
            aria-label="Remover regra"
            onClick={onDelete}
            className="w-7 rounded-full bg-[--background-color] aspect-square border border-[--border]"
          >
            <Remove fontSize="small" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RuleChip;
