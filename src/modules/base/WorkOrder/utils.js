export const statusInfo = {
  not_started: {
    label: "Não iniciado",
    severity: "info",
  },
  in_progress: {
    label: "Em andamento",
    severity: "warning",
  },
  completed: {
    label: "Concluído",
    severity: "success",
  },
  blocked: {
    label: "Atrasado",
    severity: "error",
  },
  canceled: {
    label: "Cancelado",
    severity: "error",
  },
  rejected: {
    label: "Rejeitado",
    severity: "error",
  },
};

export const taskStatuses = [
  "not_started",
  "in_progress",
  "completed",
  "rejected",
  "blocked",
  "canceled",
];

export const taskLabels = {
  audit_invalid_record: "Correção de Registro Inválido",
  generic_entity: "Entidade Genérica",
};

export const taskRoutes = {
  audit_invalid_record: "/audits/invalid-records",
  generic_entity: "/generic-entity",
};
