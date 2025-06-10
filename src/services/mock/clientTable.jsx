// interface Column {
//   label: string;
//   key: string;
//   align?: "left" | "center" | "right";
//   sortable?: boolean;
//   sortKey?: string;
// }

// {
//   columns = [],
//     data = [],
//     pagination = {
//       total: 0,
//       perPage: 10,
//       current: 1,
//     },
//     onRowClick = () => { },
//     onPageChange = () => { },
//     onRowsPerPageChange = () => { },
//     actions = [],
//     isLoading = false,
//     emptyRowsMessage = "Nenhum dado encontrado",
// }

export const mockClientTable = {
  columns: [
    { label: "ID", key: "id", align: "left", sortable: true },
    { label: "Email", key: "email", align: "left", sortable: true },
    { label: "CNPJ/CPF", key: "cnpj_cpf", align: "left", sortable: true },
  ],
  data: [
    { id: 1, email: "cliente1@example.com", cnpj_cpf: "12345678901" },
    { id: 2, email: "cliente2@example.com", cnpj_cpf: "98765432100" },
    { id: 3, email: "cliente3@example.com", cnpj_cpf: "55544433322" },
  ],
  pagination: {
    total: 3,
    perPage: 5,
    current: 1,
  },
  onPageChange: (event, newPage) => console.log("Page changed", newPage),
  onRowsPerPageChange: (event) =>
    console.log("Rows per page changed", event.target.value),
  isLoading: false,
  emptyRowsMessage: "Nenhum dado encontrado",
};
