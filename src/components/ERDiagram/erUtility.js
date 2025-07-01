const isForeignKey = (col) => {
  const deconstructed = col.name.split("_");
  var couldBeForeignKey = false;
  if (deconstructed.length > 1) {
    if (deconstructed[0] === "id") couldBeForeignKey = true;
    if (deconstructed[deconstructed.length - 1] === "id")
      couldBeForeignKey = true;
  }
  return couldBeForeignKey;
};

const getColumn = (col) => {
  return {
    ...col,
    name: col.name,
    type: col.type,
    pk: col.key === "PRI",
    fk: isForeignKey(col),
  };
};

export const getTables = (structure) => {
  const tables = Object.keys(structure);
  return tables;
};

export const parseStructure = (structure, existingTables) => {
  const tablesData = structure.map((table) => {
    const columnsData = table.columns.map((column) => getColumn(column));
    columnsData.sort((a, b) => {
      if (a.pk && !b.pk) {
        return -1;
      }
      if (!a.pk && b.pk) {
        return 1;
      }
      if (a.fk && !b.fk) {
        return 1;
      }
      if (!a.fk && b.fk) {
        return -1;
      }
      return 0;
    });
    return {
      id: table.id,
      name: table.name,
      columns: columnsData,
      isSelected: existingTables.includes(table.id),
    };
  });
  return tablesData;
};
