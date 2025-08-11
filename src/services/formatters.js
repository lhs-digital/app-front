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

  return backendRules.map((backendRule) => {
    // Find the validation object from available validations by matching the rule name
    const validationObject = availableValidations.find(
      (validation) => validation.name === backendRule.name,
    );

    return {
      id: backendRule.id,
      name: backendRule.name,
      message: backendRule.message,
      validation: validationObject || {
        id: null,
        name: backendRule.name,
        label: backendRule.label || backendRule.name,
        has_params: false,
        multiple: false,
        separator: null,
        description: "",
      },
      params: backendRule.params || "",
      priority: backendRule.priority || 1,
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
