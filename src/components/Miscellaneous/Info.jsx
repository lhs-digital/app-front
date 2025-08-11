import { InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

const Info = ({ description }) => {
  return (
    <Tooltip
      title={<p className="text-sm">{description}</p>}
      arrow
      placement="auto-end"
    >
      <button
        type="button"
        className="aspect-square rounded-full hover:bg-[--border] mx-1 p-1 transition-all ease-in-out duration-200"
        onClick={() => {}}
      >
        <InfoOutlined
          fontSize="16px"
          className="mx-auto mb-2 text-[--foreground-color]"
        />
      </button>
    </Tooltip>
  );
};

export default Info;
