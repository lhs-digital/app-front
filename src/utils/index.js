export const defaultLabelDisplayedRows = ({ from, to, count }) => {
  return `${from}–${to} de ${count !== -1 ? count : `mais que ${to}`}`;
}