import { Add, Key, Remove } from "@mui/icons-material";
import { IconButton, ListItem, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";

const TableColumn = ({
  readOnly = false,
  column,
  onAddColumn,
  onRemoveColumn,
  isAdded,
}) => {
  return (
    <ListItem
      className="flex flex-row gap-2 items-center justify-between border border-[--border] rounded-md"
      secondaryAction={
        readOnly ? null : (
          <Tooltip
            title={`${isAdded ? "Remover" : "Adicionar"} "${column.name}" ao grupo.`}
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
        )
      }
    >
      <div className="flex flex-row gap-2 items-center py-1">
        <p className="font-medium">
          {column.name}
          <span>
            {column.pk && <Key />} {column.fk && <Link />}
          </span>
        </p>
        <p className="text-sm text-neutral-500">
          {column.type || "Tipo não definido"}
        </p>
      </div>
    </ListItem>
  );
};

export default TableColumn;
