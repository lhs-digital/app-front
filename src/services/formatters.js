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
    console.log(rule);
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
