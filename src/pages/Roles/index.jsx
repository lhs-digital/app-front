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
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalDelete from "../../components/ModalDelete";
import ModalRole from "../../components/ModalRole";
import ModalViewRole from "../../components/ModalViewRole";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";
import api from "../../services/api";
import { defaultLabelDisplayedRows } from "../../utils";

const Roles = () => {
  const [viewOpen, setViewOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [dataView, setDataView] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const { permissions } = useContext(AuthContext);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/roles?page=${currentPage}`);
        setCurrentPage(response.data.meta.current_page);
        setLastPage(response.data.meta.last_page);
        setData(response.data.data);
      } catch (error) {
        console.error("Erro ao verificar lista de usuários", error);
      }
    };
    getData();
    return () => {
      setData([]);
      setCurrentPage(1);
      setViewOpen(false);
      setModalOpen(false);
      setDeleteOpen(false);
    };
  }, [setData, currentPage, lastPage, refresh]);

  const handleRemove = async () => {
    try {
      await api.delete(`/roles/${deleteId}`);
      setRefresh(!refresh);
      toast.success("Role removida com sucesso!");
      setDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao verificar lista de usuários", error);
    }
  };

  const handleCreate = () => {
    console.log("handleCreate");
    setDataEdit({});
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setDataEdit(user);
    setModalOpen(true);
  };

  const handleView = (index) => {
    const selectedRole = data;
    setDataView(selectedRole[index]);
    setViewOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.direction === "asc" && sortConfig.key === key ? "desc" : "asc";

    const sortedData = [...data].sort((a, b) => {
      const aKey = key.split(".").reduce((acc, part) => acc && acc[part], a);
      const bKey = key.split(".").reduce((acc, part) => acc && acc[part], b);

      if (aKey < bKey) return direction === "asc" ? -1 : 1;
      if (aKey > bKey) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <KeyboardArrowUp ml={2} />
    ) : (
      <KeyboardArrowDown ml={2} />
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalRole
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        setData={setData}
        dataEdit={dataEdit || null}
        setDataEdit={setDataEdit}
        setRefresh={setRefresh}
        refresh={refresh}
      />
      <ModalDelete
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleRemove}
      />
      <ModalViewRole
        selectedRole={dataView}
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
      />

      <PageTitle
        title="Gerenciamento de Roles"
        subtitle="Administração e atribuição de permissões e funções de usuários"
        buttons={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            NOVO CARGO
          </Button>
        }
      />
      <TextField
        fullWidth
        placeholder="Buscar role"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        size="lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("name")}>
                Nome
                {getSortIcon("name")}
              </TableCell>
              <TableCell onClick={() => handleSort("company.name")}>
                Empresa
                {getSortIcon("company.name")}
              </TableCell>
              <TableCell onClick={() => handleSort("permissions_count")}>
                Qtd Permissões
                {getSortIcon("permissions_count")}
              </TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!search
              ? data
              : data.filter(
                  (role) =>
                    role.name.toLowerCase().includes(search.toLowerCase()) ||
                    role.company?.name
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                )
            ).map(({ name, nivel, company, permissions_count, id }, index) => (
              <TableRow
                key={index}
                style={{
                  cursor: "pointer",
                  backgroundColor: index % 2 === 0 ? "white" : "#f7fafc",
                }}
                onClick={() => handleView(index)}
              >
                <TableCell>{name}</TableCell>
                <TableCell>{company?.name}</TableCell>
                <TableCell>{permissions_count}</TableCell>
                <TableCell>
                  <div className="flex flex-row">
                    {permissions.some(
                      (permissions) => permissions.name === "update_roles",
                    ) && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit({ name, nivel, company, id, index });
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                    {permissions.some(
                      (permissions) => permissions.name === "delete_roles",
                    ) && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={defaultLabelDisplayedRows}
        />
      </TableContainer>
    </div>
  );
};

export default Roles;
