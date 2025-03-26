import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalDelete from "../../components/ModalDelete";
import PageTitle from "../../components/PageTitle";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";
import { hasPermission } from "../../services/utils";

const Clients = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const navigate = useNavigate();
  const { permissions } = useUserState().state;
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [sortedData, setSortedData] = useState([]);

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["clients", currentPage, rowsPerPage, search],
    queryFn: async () => {
      const response = await api.get(
        `/clients?page=${currentPage}&per_page=${rowsPerPage}`,
        {
          params: { search: search },
        },
      );
      setTotalCount(response.data.total);
      return response.data.data;
    },
  });

  const handleSort = (key) => {
    const direction =
      sortConfig.direction === "asc" && sortConfig.key === key ? "desc" : "asc";
    const newSortedData = [...sortedData];
    newSortedData.sort((a, b) => {
      const aKey = key.split(".").reduce((acc, part) => acc && acc[part], a);
      const bKey = key.split(".").reduce((acc, part) => acc && acc[part], b);

      if (aKey < bKey) return direction === "asc" ? -1 : 1;
      if (aKey > bKey) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setSortedData(newSortedData);
  };

  const createSortHandler = (key) => () => {
    handleSort(key);
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/clients/${deleteId}`);
      toast.success("Cliente removido com sucesso!");
      setDeleteOpen(false);
    } catch (error) {
      console.error(`Erro ao deletar cliente com ID: ${deleteId}`, error);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isSuccess) {
      setSortedData(data);
    }
  }, [isSuccess, data]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalDelete
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleRemove}
      />
      <PageTitle
        title="Clientes"
        subtitle="Administre, edite e remova clientes conforme necessário"
        buttons={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => navigate("/clientes/novo")}
          >
            NOVO CADASTRO
          </Button>
        }
      />
      <TextField
        mt={4}
        placeholder="Buscar cliente"
        size="lg"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sortDirection={
                  sortConfig.key === "id" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "id"}
                  direction={
                    sortConfig.key === "id" ? sortConfig.direction : "asc"
                  }
                  onClick={createSortHandler("id")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "email" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "email"}
                  direction={
                    sortConfig.key === "email" ? sortConfig.direction : "asc"
                  }
                  onClick={createSortHandler("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "cnpj_cpf" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "cnpj_cpf"}
                  direction={
                    sortConfig.key === "cnpj_cpf" ? sortConfig.direction : "asc"
                  }
                  onClick={createSortHandler("cnpj_cpf")}
                >
                  CNPJ/CPF
                </TableSortLabel>
              </TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={4} rowSpan={2} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
            {!isFetching && sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan="5" textAlign="center">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedData
                .filter((client) =>
                  [
                    client.id,
                    client.email,
                    client.cnpj_cpf,
                    client.whatsapp,
                  ].some((field) =>
                    field
                      .toString()
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  ),
                )
                .map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-gray-600/20 transition-all"
                    onClick={() =>
                      hasPermission(permissions, "view_clients") &&
                      navigate(`/clientes/${client.id}`)
                    }
                  >
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.cnpj_cpf}</TableCell>
                    <TableCell sx={{ padding: 0, paddingLeft: 1 }}>
                      {hasPermission(permissions, "update_clients") && (
                        <IconButton
                          onClick={() => {
                            navigate(`/clientes/${client.id}`, {
                              state: { edit: true },
                            });
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                      {hasPermission(permissions, "delete_clients") && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(client?.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          labelRowsPerPage="Linhas por página"
          rowsPerPage={rowsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </TableContainer>
    </div>
  );
};

export default Clients;