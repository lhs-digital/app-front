import { colors } from "@mui/material";

export const priorities = [
  { value: 1, label: "Baixa" },
  { value: 2, label: "Moderada" },
  { value: 3, label: "Urgente" },
];

export const formattedPriority = (priority) => {
  switch (priority) {
    case 1:
      return "Baixa";
    case 2:
      return "Moderada";
    case 3:
      return "Urgente";
    default:
      return "Muito Baixa";
  }
};

export const getPriorityColor = (priority, theme) => {
  switch (priority) {
    case 1:
      return {
        color: theme === "light" ? colors.grey[700] : colors.grey[200],
        backgroundColor:
          theme === "light" ? colors.grey[200] : colors.grey[700],
      };
    case 2:
      return {
        color: theme === "light" ? colors.amber[600] : colors.amber[200],
        backgroundColor:
          theme === "light" ? colors.amber[100] : colors.amber[700],
      };
    case 3:
      return {
        color: theme === "light" ? colors.red[600] : colors.grey[50],
        backgroundColor: theme === "light" ? colors.red[100] : colors.red[800],
      };
    default:
      return {
        color: theme === "light" ? colors.grey[700] : colors.grey[200],
        backgroundColor:
          theme === "light" ? colors.grey[200] : colors.grey[700],
      };
  }
};

export const dateFormatted = (date) => {
  if (!date) {
    return "Data não informada";
  }

  if (date.includes(" ")) {
    const dateObj = new Date(
      date.includes(" ") ? date.replace(" ", "T") + "Z" : date,
    );
    const datePart = dateObj.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
    const timePart = dateObj.toLocaleTimeString("pt-BR", {
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} às ${timePart}`;
  } else {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });
  }
};

export const validarEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0,
    resto;

  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
};

export const validarCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]/g, "");

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros[tamanho - i] * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos[0])) return false;

  tamanho++;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros[tamanho - i] * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos[1])) return false;

  return true;
};

export const validarDataNascimento = (data) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(data)) return false;
  const hoje = new Date();
  const nascimento = new Date(data);
  const idadeMinima = 18;

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade >= idadeMinima;
};

export const defaultLabelDisplayedRows = ({ from, to, count }) => {
  return `${from}–${to} de ${count !== -1 ? count : `mais que ${to}`}`;
};

export const formatUserObject = (user) => ({
  id: user?.id,
  name: user?.name,
  email: user?.email,
  role: {
    id: user?.role?.id,
    name: user?.role?.name,
    level: user?.role?.nivel,
  },
  company: user?.company,
  isLighthouse: user?.company?.is_super_admin === true,
  permissions: user?.role?.permissions ?? [],
});

export const handlePermissionName = (name) => {
  const action = name.split("_")[0];
  const entity = name.split("_")[1];

  const actionMap = {
    view: entity === "any" ? "Listar" : "Visualizar",
    create: "Criar",
    update: "Editar",
    delete: "Deletar",
  };

  if (actionMap[action]) {
    return actionMap[action];
  }

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const hasPermission = (permissions, permission) => {
  return permissions.some((p) => p.name === permission);
};

export const validations = [
  {
    id: 1,
    name: "required",
    label: "É obrigatório(a)",
    has_params: 0,
    description: "Campo obrigatório",
    field: null,
  },
  {
    id: 2,
    name: "cpf_cnpj",
    label: "É um CPF ou CNPJ",
    has_params: 1,
    description:
      "Verifica se é um CPF ou CNPJ. Esta regra depende de valores como: F (pessoa física), J (Pessoa jurídica) e E (Estrangeiro).",
    field: null,
  },
  {
    id: 3,
    name: "is_of_legal_age",
    label: "É maior de idade",
    has_params: 0,
    description:
      "Verifica se a idade da pessoa é igual ou superior ao limite definido como maioridade",
    field: null,
  },
  {
    id: 4,
    name: "date",
    label: "É uma data",
    has_params: 0,
    description: "Verifica se é uma data válida",
    field: null,
  },
  {
    id: 5,
    name: "multi_email",
    label: "É um email",
    has_params: 0,
    description: "Verifica se é um email válido.",
    field: null,
  },
  {
    id: 6,
    name: "in",
    label: "Está em",
    has_params: 1,
    description:
      "Verifica se os valores inseridos estão dentro do grupo de valores aceitos por essa regra.",
    field: "array",
  },
  {
    id: 7,
    name: "not_in",
    label: "Não está em",
    has_params: 1,
    description:
      "Verifica se os valores inseridos não estão dentro do grupo de valores aceitos por essa regra.",
    field: "array",
  },
];

export const validationLabels = {
  required: "É obrigatório(a)",
  cpf_cnpj: "É um CPF ou CNPJ",
  is_of_legal_age: "É maior de idade",
  date: "É uma data",
  multi_email: "É um email",
  in: "Está em",
  not_in: "Não está em",
};

export const severities = [
  { label: "Baixa", name: "low", value: 1 },
  { label: "Moderada", name: "medium", value: 2 },
  { label: "Urgente", name: "high", value: 3 },
];

export const severityLabels = {
  1: "Baixa",
  2: "Moderada",
  3: "Urgente",
};

export const formatInterval = (interval) => {
  const intervals = {
    600: "10 minutos",
    900: "15 minutos",
    1800: "30 minutos",
    3600: "1 hora",
    7200: "2 horas",
    14400: "4 horas",
    21600: "6 horas",
    43200: "12 horas",
    86400: "1 dia",
    604800: "1 semana",
    2592000: "1 mês",
    7776000: "3 meses",
    15552000: "6 meses",
    31536000: "1 ano",
  };

  return intervals[interval];
};