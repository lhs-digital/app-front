import { TableChartOutlined } from "@mui/icons-material";
import { useEffect } from "react";

const PageTitle = ({
  title,
  subtitle = "",
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
          {icon}
          <p className="text-xl font-bold">{title}</p>
        </div>
        <div className="text-sm text-gray-400">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">{buttons}</div>
    </div>
  );
};

export default PageTitle;
