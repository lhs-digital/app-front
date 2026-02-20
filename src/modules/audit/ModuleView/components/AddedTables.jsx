import { InfoOutlined, SellOutlined } from "@mui/icons-material";
import RuleChip from "../../ModuleTable/components/RuleChip";

const AddedTables = ({ tables, onColumnClick }) => {
  const columnCount = tables.reduce(
    (acc, table) => acc + table.columns.length,
    0,
  );
  const ruleCount = tables.reduce(
    (acc, table) =>
      acc + table.columns.reduce((acc, column) => acc + column.rules.length, 0),
    0,
  );
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-row items-center justify-between gap-1 p-2 border-b border-[--border]">
        <div className="flex items-center gap-2">
          <SellOutlined fontSize="small" color="inherit" />
          <h2>Regras adicionadas</h2>
        </div>
        <div className="flex items-center gap-1 text-sm text-neutral-400">
          <InfoOutlined fontSize="small" color="inherit" />
          <p>
            {ruleCount} regra{ruleCount !== 1 && "s"} ativa
            {ruleCount !== 1 && "s"} em {columnCount} coluna
            {columnCount !== 1 && "s"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {tables.map((table) =>
          table.columns.map((column) => (
            <RuleChip
              key={column.id}
              column={column}
              tableName={table.label || table.name}
              readOnly
              onClick={() => onColumnClick(column, table)}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default AddedTables;
