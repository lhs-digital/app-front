import { TableChartOutlined } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { useEffect } from "react";

const PageTitle = ({
  title,
  subtitle = "",
  tag = "",
  buttons = <></>,
  icon = <TableChartOutlined fontSize="small" />,
}) => {
  useEffect(() => {
    document.title = `LHS - ${title}`;
  }, [title]);

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <div>
        <div className="flex flex-row gap-2 items-center">
          <span className="mb-0.5">{icon}</span>
          <p className="text-xl font-bold">{title}</p>
        </div>
        <div className="text-sm text-neutral-400 flex flex-row gap-2 items-center">
          {subtitle}
          {tag && (
            <Chip
              label={<p className="text-xs text-neutral-500">{tag}</p>}
              size="small"
              variant="outlined"
            />
          )}
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">{buttons}</div>
    </div>
  );
};

export default PageTitle;
