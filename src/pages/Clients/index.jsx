import {
  Add,
  Delete,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";
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
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalClient from "../../components/ModalClient";
import ModalDeleteClient from "../../components/ModalDeleteClient";
import ModalViewClient from "../../components/ModalViewClient";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";
import api from "../../services/api";

const Clients = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [dataView, setDataView] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const { permissions } = useContext(AuthContext);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/clients?page=${currentPage}`);
        setData(response.data.data);
        setCurrentPage(response.data.from);
        setLastPage(response.data.last_page);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        toast.error("Erro ao carregar a lista de clientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentPage, refresh]);

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

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <KeyboardArrowUp />
    ) : (
      <KeyboardArrowDown />
    );
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
      <ModalDeleteClient
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
        title="Gerenciamento de Clientes"
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
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("id")}>
                ID {getSortIcon("id")}
              </TableCell>
              <TableCell onClick={() => handleSort("email")}>
                Email {getSortIcon("email")}
              </TableCell>
              <TableCell onClick={() => handleSort("cnpj_cpf")}>
                CNPJ/CPF {getSortIcon("cnpj_cpf")}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
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
                .map((client, index) => (
                  <TableRow
                    key={client.id}
                    cursor="pointer"
                    _hover={{ bg: "gray.50" }}
                    _odd={{ bg: "gray.100" }}
                    _even={{ bg: "white" }}
                    onClick={() => handleView(client)}
                  >
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.cnpj_cpf}</TableCell>
                    <TableCell>
                      {permissions.some(
                        (perm) => perm.name === "update_users",
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
                    </TableCell>
                    <TableCell>
                      {permissions.some(
                        (perm) => perm.name === "delete_users",
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
          component="div"
          count={data.length}
          page={currentPage - 1}
          onPageChange={(event, newPage) => setCurrentPage(newPage + 1)}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>
    </div>
  );
};

export default Clients;
