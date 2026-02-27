/**
 * Utility functions for formatting data between backend and frontend
 */

/**
 * Formats backend rules to frontend format
 * @param {Array} backendRules - Array of rules from backend
 * @param {Array} availableValidations - Array of available validation objects
 * @returns {Array} Formatted rules for frontend
 */
export const formatBackendRulesToFrontend = (
  backendRules,
  availableValidations,
) => {
  if (!backendRules || !Array.isArray(backendRules)) {
    return [];
  }

  return backendRules.map((rule) => {
    // Find the validation object from available validations by matching the rule name
    const validationObject = availableValidations.find(
      (validation) => validation.name === rule.name,
    );

    return {
      id: rule.id,
      name: rule.name,
      message: rule.message,
      validation: validationObject || {
        id: null,
        name: rule.name,
        label: rule.label || rule.name,
        has_params: false,
        multiple: false,
        separator: null,
        description: "",
      },
      params: rule.params || "",
      priority: rule.priority || 1,
    };
  });
};

/**
 * Formats frontend rules to backend format
 * @param {Array} frontendRules - Array of rules from frontend
 * @returns {Array} Formatted rules for backend
 */
export const formatFrontendRulesToBackend = (frontendRules) => {
  if (!frontendRules || !Array.isArray(frontendRules)) {
    return [];
  }

  return frontendRules.map((frontendRule) => ({
    id: frontendRule.id,
    name: frontendRule.name || frontendRule.validation?.name,
    label: frontendRule.validation?.label || frontendRule.name,
    params: frontendRule.params,
    message: frontendRule.message,
    priority: frontendRule.priority || 1,
  }));
};

export const trimText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const formatCpfCnpj = (cpfCnpj) => {
  if (!cpfCnpj) return "--";
  if (cpfCnpj.length === 11)
    return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  return cpfCnpj.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
};

export const formatDuration = (duration) => {
  if (!duration) return "N/A";
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes} min ${seconds} s`;
};

export const formatAuditStatus = (status, capitalize = false) => {
  if (status === "success") return capitalize ? "Concluído" : "concluído";
  if (status === "pending") return capitalize ? "Pendente" : "pendente";
  if (status === "failed") return capitalize ? "Falhou" : "falhou";
  return capitalize ? "N/A" : "n/a";
};

export const formatRulesPayload = (rules) => {
  if (!rules || !Array.isArray(rules)) return [];
  return rules.map((rule) => {
    const formattedRule = {
      id: rule.rule_id || rule.validation?.id,
      name: rule.name || rule.validation?.name,
      message: rule.message,
      params: rule.params || "",
      priority: rule.priority || 1,
      label: rule.label || rule.name,
    };
    if (rule.audit_table_id) {
      formattedRule.audit_table_id = rule.audit_table_id;
    }
    return formattedRule;
  });
};

/**
 * Merges pending column changes with server structure and formats for the module tables API.
 * Preserves unchanged columns, applies edits, includes new columns, and excludes removed columns.
 *
 * @param {Object} pendingChanges - { [tableId]: { company_table_id, columns: [], deleted?: number[] } }
 * @param {Array} structure - Server tables from structure API (each with id, columns[])
 * @returns {Array} Array of { company_table_id, columns } ready for POST
 */
export const formatModuleTablesPayload = (pendingChanges, structure) => {
  if (!pendingChanges || typeof pendingChanges !== "object") return [];
  if (!structure || !Array.isArray(structure)) return [];

  return Object.entries(pendingChanges).map(([tableId, table]) => {
    const numericTableId = table.company_table_id ?? Number(tableId);
    const deletedIds = new Set(table.deleted ?? []);

    const serverTable = structure.find((t) => t.id === numericTableId);
    const serverColumnsWithRules = (serverTable?.columns ?? []).filter(
      (col) => (col.rules?.length ?? 0) > 0 && !deletedIds.has(col.id),
    );

    const pendingCols = (table.updated ?? []).filter(
      (c) => !deletedIds.has(c.id),
    );
    const pendingMap = new Map(pendingCols.map((c) => [c.id, c]));
    const mergedColumns = serverColumnsWithRules.map(
      (col) => pendingMap.get(col.id) ?? col,
    );

    for (const pendingCol of pendingCols) {
      if (!mergedColumns.some((c) => c.id === pendingCol.id)) {
        mergedColumns.push(pendingCol);
      }
    }

    return {
      company_table_id: numericTableId,
      columns: mergedColumns.map((column) => ({
        company_table_id: numericTableId,
        id: column.id,
        label: column.label,
        form: column.form || {},
        rules: formatRulesPayload(column.rules),
      })),
    };
  });
};

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
