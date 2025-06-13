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
    name: col.name,
    type: col.type,
    pk: col.key === "PRI",
    fk: isForeignKey(col),
  };
};

export const parseStructure = (structure) => {
  const tables = Object.keys(structure);
  const tablesData = tables.map((table) => {
    const { columns } = structure[table];
    const columnsData = columns.map((column) => getColumn(column));
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
      name: table,
      columns: columnsData,
      hasModule: Math.random() < 0.5,
    };
  });
  return tablesData;
};
