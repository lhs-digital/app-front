/**
 * Pure helpers for pending column changes (save/remove).
 * Each returns a new pendingChanges object; does not mutate.
 *
 * @typedef {{ company_table_id: number, updated: Array, deleted: Array }} TablePendingEntry
 * @typedef {Record<string, TablePendingEntry>} PendingChanges
 */

const emptyTableEntry = (tableId) => ({
  company_table_id: tableId,
  updated: [],
  deleted: [],
});

/**
 * Apply a column save (add or update) to pending changes.
 * @param {PendingChanges} prev - Current pending changes by table id
 * @param {number} tableId - Table id
 * @param {Object} column - Column object (with id)
 * @returns {PendingChanges} New pending changes
 */
export function applyColumnSave(prev, tableId, column) {
  const tableEntry = prev[tableId] ?? emptyTableEntry(tableId);
  const existingIdx = tableEntry.updated.findIndex((c) => c.id === column.id);
  const updatedColumns =
    existingIdx >= 0
      ? tableEntry.updated.map((c, i) => (i === existingIdx ? column : c))
      : [...tableEntry.updated, column];
  const updatedDeleted =
    tableEntry.deleted?.filter((id) => id !== column.id) ?? [];

  return {
    ...prev,
    [tableId]: {
      ...tableEntry,
      updated: updatedColumns,
      deleted: updatedDeleted,
    },
  };
}

/**
 * Apply a column removal to pending changes.
 * @param {PendingChanges} prev - Current pending changes by table id
 * @param {number} tableId - Table id
 * @param {number|string} columnId - Column id to remove
 * @returns {PendingChanges} New pending changes
 */
export function applyColumnRemove(prev, tableId, columnId) {
  const tableEntry = prev[tableId];
  if (!tableEntry) {
    return {
      ...prev,
      [tableId]: {
        ...emptyTableEntry(tableId),
        deleted: [columnId],
      },
    };
  }

  const updatedColumns = tableEntry.updated.filter((c) => c.id !== columnId);
  const deleted = tableEntry.deleted ?? [];

  if (updatedColumns.length === 0) {
    return {
      ...prev,
      [tableId]: {
        ...tableEntry,
        updated: [],
        deleted: [...deleted, columnId],
      },
    };
  }

  return {
    ...prev,
    [tableId]: {
      ...tableEntry,
      updated: updatedColumns,
      deleted: [...deleted, columnId],
    },
  };
}
