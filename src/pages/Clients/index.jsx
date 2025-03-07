import { Add, Delete, Edit, Search } from "@mui/icons-material";
import {
  Button,
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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalClient from "../../components/ModalClient";
import ModalDelete from "../../components/ModalDelete";
import ModalViewClient from "../../components/ModalViewClient";
import PageTitle from "../../components/PageTitle";
import api from "../../services/api";

const Clients = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [dataView, setDataView] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  //eslint-disable-next-line
  const [lastPage, setLastPage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const { permissions } = useAuthUser().user;

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/clients?page=${currentPage}&per_page=${rowsPerPage}`,
          {
            params: {
              search: search,
            },
          },
        );
        const sortedData = response.data.data.sort((a, b) => b.id - a.id);
        setData(sortedData);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
        setTotalCount(response.data.total);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error("Erro ao carregar a lista de clientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentPage, search, refresh]);

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const createSortHandler = (key) => () => {
    handleSort(key);
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/clients/${deleteId}`);
      setRefresh(!refresh);
      toast.success("Client removido com sucesso!");
      setDeleteOpen(false);
    } catch (error) {
      console.error(`Erro ao delter cliente com ID: ${deleteId}`, error);
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleEdit = (client) => {
    setDataEdit(client);
    setModalOpen(true);
  };

  const handleView = (client) => {
    setDataView(client);
    setViewOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    setRefresh((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalClient
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        setData={setData}
        dataEdit={dataEdit}
        setDataEdit={setDataEdit}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      <ModalDelete
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleRemove}
      />
      <ModalViewClient
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        selectedUser={dataView}
      />
      <PageTitle
        title="Clientes"
        subtitle="Administre, edite e remova clientes conforme necessário"
        buttons={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => [setDataEdit({}), setModalOpen(true)]}
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
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan="5" textAlign="center">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              data
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
                    cursor="pointer"
                    onClick={() => handleView(client)}
                  >
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.cnpj_cpf}</TableCell>
                    <TableCell sx={{ padding: 0, paddingLeft: 1 }}>
                      {permissions.some(
                        (perm) => perm.name === "update_clients",
                      ) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(client);
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      )}
                      {permissions.some(
                        (perm) => perm.name === "delete_clients",
                      ) && (
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
