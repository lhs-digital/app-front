import RuleChip from "../../ModuleTable/components/RuleChip";

const AddedTables = ({ tables }) => {
  const selectedTables = tables.filter((table) => table.rules.length > 0);
  return (
    <div className="flex flex-row gap-2 flex-wrap px-2 py-4 border border-[--border] rounded-md min-h-24">
      {selectedTables.map((table) => (
        <RuleChip key={table.id} column={table} />
      ))}
    </div>
  );
};

export default AddedTables;
