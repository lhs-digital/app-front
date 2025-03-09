const permissions = {
  "/painel": [],
  "/auditorias": ["view_any_tasks", "update_tasks"],
  "/empresas": [
    "view_companies",
    "view_any_companies",
    "create_companies",
    "update_companies",
    "delete_companies",
  ],
  "/papeis": [
    "view_roles",
    "view_any_roles",
    "create_roles",
    "update_roles",
    "delete_roles",
  ],
  "/usuarios": [
    "view_users",
    "view_any_users",
    "create_users",
    "update_users",
    "delete_users",
  ],
  "/clientes": [
    "view_clients",
    "view_any_clients",
    "create_clients",
    "update_clients",
    "delete_clients",
  ],
  "/atribuicoes": [],
  "/prioridades": ["define_rules"],
  "/permissoes": [],
  "/logs": [],
};

export const pagePermissions = (path) => permissions[path] ?? [];
