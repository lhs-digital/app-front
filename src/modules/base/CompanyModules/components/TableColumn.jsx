import { Add, Key, Remove } from "@mui/icons-material";
import { IconButton, ListItem, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

const TableColumn = ({ column, onAddColumn, onRemoveColumn, isAdded }) => {
  return (
    <ListItem
      className="flex flex-row gap-2 items-center justify-between"
      secondaryAction={
        <Tooltip
          title={`${isAdded ? "Remover" : "Adicionar"} "${column.name}" ao módulo`}
          placement="right"
          arrow
        >
          <IconButton
            size="small"
            onClick={isAdded ? onRemoveColumn : onAddColumn}
          >
            {isAdded ? <Remove /> : <Add />}
          </IconButton>
        </Tooltip>
      }
    >
      <div className="flex flex-row gap-2 items-center">
        <p className="font-medium">
          {column.name}{" "}
          <span>
            {column.pk && <Key />} {column.fk && <Link />}
          </span>
        </p>
        <p className="text-sm text-neutral-500">{column.type}</p>
      </div>
    </ListItem>
  );
};

export default TableColumn;
