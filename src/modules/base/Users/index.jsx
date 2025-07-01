import {
  Add,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  Groups,
  Person,
  Search,
} from "@mui/icons-material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import {
  Button,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast } from "react-toastify";
import ModalDelete from "../../../components/ModalDelete";
import { useUserState } from "../../../hooks/useUserState";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import ModalComp from "./components/ModalComp";
import ModalHierarchy from "./components/ModalHierarchy";
import ModalView from "./components/ModalView";

const Users = () => {
  const [viewOnly, setViewOnly] = useState(false);
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dataEdit, setDataEdit] = useState({});
  const [dataView, setDataView] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [desHierarchy, setDesHierarchy] = useState(false);
  const [viewHierarchy, setViewHierarchy] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const onOpenCreate = () => setIsCreateOpen(true);
  const onCloseCreate = () => setIsCreateOpen(false);

  const onOpenHierarchy = () => setIsHierarchyOpen(true);
  const onHierarchyClose = () => setIsHierarchyOpen(false);

  const onOpenDelete = () => setIsDeleteOpen(true);
  const onCloseDelete = () => setIsDeleteOpen(false);

  const onOpenView = () => setIsViewOpen(true);
  const onCloseView = () => setIsViewOpen(false);

  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const user = useAuthUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const hierarchyOpen = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { permissions } = useUserState().state;

  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/users?page=${currentPage}&per_page=${rowsPerPage}`,
          {
            params: {
              search: search,
            },
          },
        );
        console.log(response.data);
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

  const handleHierarchy = (user) => {
    setSelectedUser(user);
    onOpenHierarchy();
  };

  const handleViewHierarchy = (user) => {
    setViewHierarchy(true);
    setSelectedUser(user);
    onOpenHierarchy();
  };

  const handleDesHierarchy = (user) => {
    setDesHierarchy(true);
    setSelectedUser(user);
    onOpenHierarchy();
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

  const hierarchyMenu = () => (
    <Menu
      className="mt-2"
      id="hierarchy-menu"
      aria-labelledby="hierarchy-menu"
      anchorEl={anchorEl}
      open={hierarchyOpen}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {/* Visualizar equipe: Qualquer uma das permissões */}
      {permissions.some(
        (permission) =>
          permission.name === "assign_responsible_users" ||
          permission.name === "unassign_responsible_users",
      ) && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleViewHierarchy();
            }}
          >
            <ListItemIcon>
              <Groups fontSize="small" />
            </ListItemIcon>
            <ListItemText>Visualizar equipe</ListItemText>
          </MenuItem>
        )}

      {/* Adicionar membro: Permissão específica */}
      {permissions.some(
        (permission) => permission.name === "assign_responsible_users",
      ) && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleHierarchy();
            }}
          >
            <ListItemIcon>
              <GroupAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Adicionar membro</ListItemText>
          </MenuItem>
        )}

      {/* Remover membro: Permissão específica */}
      {permissions.some(
        (permission) => permission.name === "unassign_responsible_users",
      ) && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleDesHierarchy();
            }}
          >
            <ListItemIcon>
              <GroupRemoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remover membro</ListItemText>
          </MenuItem>
        )}
    </Menu>
  );

  const renderButtons = () => {
    const canCreateUsers = permissions.some(
      (permission) => permission.name === "create_users",
    );

    const canManageTeam = permissions.some(
      (permission) =>
        permission.name === "assign_responsible_users" ||
        permission.name === "unassign_responsible_users",
    );

    return (
      <>
        {canManageTeam && (
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            variant="contained"
            color="primary"
            endIcon={hierarchyOpen ? <ExpandLess /> : <ExpandMore />}
          >
            EQUIPES
          </Button>
        )}
        {canCreateUsers && (
          <Button
            onClick={() => [setDataEdit({}), onOpenCreate()]}
            variant="contained"
            color="primary"
            startIcon={<Add />}
          >
            NOVO USUÁRIO
          </Button>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {hierarchyMenu()}
      <ModalComp
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        data={data}
        setRefresh={setRefresh}
        refresh={refresh}
        setData={setData}
      />
      <ModalHierarchy
        isOpen={isHierarchyOpen}
        selectedUser={selectedUser}
        onClose={onHierarchyClose}
        setRefresh={setRefresh}
        desHierarchy={desHierarchy}
        setDesHierarchy={setDesHierarchy}
        viewHierarchy={viewHierarchy}
        setViewHierarchy={setViewHierarchy}
        refresh={refresh}
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
        icon={<Person />}
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
              <TableCell
                sortDirection={
                  sortConfig.key === "responsible"
                    ? sortConfig.direction
                    : false
                }
                sx={{
                  display: isMobile ? "none" : undefined,
                }}
              >
                <TableSortLabel
                  active={sortConfig.key === "responsible"}
                  direction={
                    sortConfig.key === "responsible"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("responsible")}
                >
                  Usuário Responsável
                </TableSortLabel>
                {console.log("user", user)}
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
            ).map(({ name, email, role, company, id, responsible }, index) => (
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
                <TableCell sx={{
                  maxWidth: isMobile ? 100 : 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }} a>
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
                <TableCell
                  sx={{
                    maxWidth: isMobile ? 5 : 100,
                    display: isMobile ? "none" : undefined,
                  }}
                >
                  {responsible ? responsible.name : <span>N/A</span>}
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
                  {/* {permissions.some(
                    (permissions) => permissions.name === "delete_users",
                  ) && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHierarchy({ name, email, role, company, id });
                        }}
                      >
                        <GroupAddIcon fontSize="small" />
                      </IconButton>
                    )} */}
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
