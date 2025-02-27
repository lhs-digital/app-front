import { useDisclosure } from "@chakra-ui/react";
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
  useMediaQuery,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalComp from "../../components/ModalComp";
import ModalDelete from "../../components/ModalDelete";
import ModalView from "../../components/ModalView";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";
import api from "../../services/api";

const Users = () => {
  const [viewOnly, setViewOnly] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onOpenView,
    onClose: onCloseView,
  } = useDisclosure();
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [dataView, setDataView] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const { permissions } = useContext(AuthContext);

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/users?page=${currentPage}&per_page=${rowsPerPage}`, {
            params: {
              search: search,
            },
          }
        );
        setCurrentPage(response.data.meta.current_page);
        setData(response.data.data);
        setTotalCount(response.data.meta.total);
      } catch (error) {
        console.error("Erro ao verificar lista de usuários", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [setData, currentPage, search, refresh]);

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

  const createSortHandler = (key) => () => {
    handleSort(key);
  };

  const handleRemove = async () => {
    try {
      await api.delete(`/users/${deleteId}`);
      setRefresh(!refresh);
      toast.success("Usuário removido com sucesso!");
      onCloseDelete();
    } catch (error) {
      console.error("Erro ao verificar lista de usuários", error);
    }
  };

  const handleEdit = (index) => {
    const selectedUser = data;
    setDataView(selectedUser[index]);
    setViewOnly(false);
    onOpenView();
  };

  const handleView = (index) => {
    const selectedUser = data;
    setDataView(selectedUser[index]);
    setViewOnly(true);
    onOpenView();
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    onOpenDelete();
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

  const renderButtons = () => {
    if (permissions.some((permissions) => permissions.name === "create_users"))
      return (
        <Button
          onClick={() => [setDataEdit({}), onOpen()]}
          variant="contained"
          color="primary"
          startIcon={<Add />}
        >
          NOVO USUÁRIO
        </Button>
      );
    else return null;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalComp
        isOpen={isOpen}
        onClose={onClose}
        data={data}
        setRefresh={setRefresh}
        refresh={refresh}
        setData={setData}
      />
      <ModalDelete
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        onConfirm={handleRemove}
      />
      <ModalView
        dataEdit={dataEdit}
        viewOnly={viewOnly}
        setDataEdit={setDataEdit}
        selectedUser={dataView}
        isOpen={isViewOpen}
        setRefresh={setRefresh}
        refresh={refresh}
        onClose={onCloseView}
      />
      <PageTitle
        title="Usuários"
        subtitle="Administre, edite e remova usuários conforme necessário."
        buttons={renderButtons()}
      />
      <TextField
        fullWidth
        placeholder="Buscar usuário"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
        size="lg"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sortDirection={
                  sortConfig.key === "name" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "name"}
                  direction={
                    sortConfig.key === "name" ? sortConfig.direction : "asc"
                  }
                  onClick={createSortHandler("name")}
                >
                  Nome
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
                  E-mail
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "role.name" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "role.name"}
                  direction={
                    sortConfig.key === "role.name"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("role.name")}
                >
                  Cargo
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "company.name"
                    ? sortConfig.direction
                    : false
                }
                sx={{
                  display: isMobile ? "none" : undefined,
                }}
              >
                <TableSortLabel
                  active={sortConfig.key === "company.name"}
                  direction={
                    sortConfig.key === "company.name"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("company.name")}
                >
                  Empresa
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ padding: 0 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!search
              ? data
              : data.filter(
                (user) =>
                  user.name.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase()) ||
                  user.role.name.toLowerCase().includes(search.toLowerCase()),
              )
            ).map(({ name, email, role, company, id }, index) => (
              <TableRow
                key={index}
                style={{
                  cursor: "pointer",
                }}
                onClick={() => handleView(index)}
              >
                <TableCell sx={{ maxWidth: isMobile ? 5 : 100 }}>
                  {" "}
                  {name}{" "}
                </TableCell>
                <TableCell sx={{ maxWidth: isMobile ? 5 : 100 }}>
                  {" "}
                  {email}{" "}
                </TableCell>
                <TableCell sx={{ maxWidth: isMobile ? 5 : 100 }}>
                  {" "}
                  {role.name}{" "}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: isMobile ? 5 : 100,
                    display: isMobile ? "none" : undefined,
                  }}
                >
                  {" "}
                  {company.name}{" "}
                </TableCell>
                <TableCell sx={{ padding: 0 }}>
                  {permissions.some(
                    (permissions) => permissions.name === "update_users",
                  ) && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(index);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                  {permissions.some(
                    (permissions) => permissions.name === "delete_users",
                  ) && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(id);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                </TableCell>
              </TableRow>
            ))}
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

export default Users;
