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
  // eslint-disable-next-line
  const regex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  return regex.test(cpf);
};

export const validarCNPJ = (cnpj) => {
  // eslint-disable-next-line
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
  return regex.test(cnpj);
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
