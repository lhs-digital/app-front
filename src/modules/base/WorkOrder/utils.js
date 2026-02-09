export const statusInfo = {
  not_started: {
    label: "Não iniciado",
    severity: "info",
  },
  visualized: {
    label: "Visualizado",
    severity: "info",
  },
  in_progress: {
    label: "Em andamento",
    severity: "warning",
  },
  canceled: {
    label: "Cancelado",
    severity: "error",
  },
  completed: {
    label: "Concluído",
    severity: "success",
  },
  blocked: {
    label: "Atrasado",
    severity: "error",
  },
  rejected: {
    label: "Rejeitado",
    severity: "error",
  },
  corrected: {
    label: "Corrigido",
    severity: "success",
  },
  reopened: {
    label: "Reaberto",
    severity: "error",
  },
  closed: {
    label: "Fechado",
    severity: "success",
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
