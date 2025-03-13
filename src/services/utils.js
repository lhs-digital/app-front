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

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 1:
      return { color: colors.grey[700], backgroundColor: colors.grey[200] };
    case 2:
      return { color: colors.amber[600], backgroundColor: colors.amber[100] };
    case 3:
      return { color: colors.red[600], backgroundColor: colors.red[100] };
    default:
      return { color: colors.grey[600], backgroundColor: colors.grey[100] };
  }
};

export const dateFormatted = (date) =>
  new Date(date).toLocaleDateString("pt-BR");

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
  isLighthouse: user?.company?.is_super_admin || false,
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
