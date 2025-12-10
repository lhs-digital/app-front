import {
  Add,
  Delete,
  Edit,
  ExpandLess,
  ExpandMore,
  Groups,
  People,
  PeopleAltOutlined,
  Search,
} from "@mui/icons-material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import {
  Button,
  CircularProgress,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ModalDelete from "../../../components/ModalDelete";
import { useCompany } from "../../../hooks/useCompany";
import { useUserState } from "../../../hooks/useUserState";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import ModalHierarchy from "./components/ModalHierarchy";
import ModalUser from "./components/ModalUser";

const Users = () => {
  const [modalState, setModalState] = useState({
    type: null, // 'user' | 'hierarchy' | 'delete'
    isOpen: false,
  });

  const [userModal, setUserModal] = useState({
    user: null,
    viewOnly: false,
  });

  const [hierarchyState, setHierarchyState] = useState({
    selectedUser: null,
    responsible: null,
    desHierarchy: false,
    viewHierarchy: false,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
  });

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const queryClient = useQueryClient();
  const { permissions } = useUserState().state;
  const { company } = useCompany();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data, isFetching } = useQuery({
    queryKey: [
      "users",
      pagination.currentPage,
      pagination.rowsPerPage,
      search,
      company?.id,
    ],
    queryFn: async () => {
      const params = {
        page: pagination.currentPage,
        per_page: pagination.rowsPerPage,
        search: search || undefined,
        company_id: company?.id || undefined,
      };

      const response = await api.get("/users", { params });
      setPagination((prev) => ({
        ...prev,
        currentPage: response.data.meta.current_page,
      }));
      return {
        data: response.data.data,
        total: response.data.meta.total,
      };
    },
  });

  // Derive sorted data from query data and sort config
  const sortedData = useMemo(() => {
    const users = data?.data || [];
    return [...users].sort((a, b) => {
      const aKey = sortConfig.key
        .split(".")
        .reduce((acc, part) => acc && acc[part], a);
      const bKey = sortConfig.key
        .split(".")
        .reduce((acc, part) => acc && acc[part], b);

      if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
      if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data?.data, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.direction === "asc" && prev.key === key ? "desc" : "asc",
    }));
  };

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("Usuário removido com sucesso!");
      setModalState({ type: null, isOpen: false });
      setDeleteId(null);
    },
    onError: (error) => {
      console.error("Erro ao verificar lista de usuários", error);
      toast.error("Erro ao remover usuário");
    },
  });

  const handleEdit = (index) => {
    setUserModal({ user: sortedData[index], viewOnly: false });
    setModalState({ type: "user", isOpen: true });
  };

  const handleView = (index) => {
    setUserModal({ user: sortedData[index], viewOnly: true });
    setModalState({ type: "user", isOpen: true });
  };

  const handleViewHierarchy = (responsible) => {
    setHierarchyState((prev) => ({
      ...prev,
      responsible,
      viewHierarchy: true,
    }));
    setModalState({ type: "hierarchy", isOpen: true });
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setModalState({ type: "delete", isOpen: true });
  };

  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination({
      currentPage: 1,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <Menu
        className="mt-2"
        id="hierarchy-menu"
        aria-labelledby="hierarchy-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {permissions.some(
          (permission) =>
            permission.name === "assign_responsible_users" ||
            permission.name === "unassign_responsible_users",
        ) && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setHierarchyState((prev) => ({ ...prev, viewHierarchy: true }));
              setModalState({ type: "hierarchy", isOpen: true });
            }}
          >
            <ListItemIcon>
              <Groups fontSize="small" />
            </ListItemIcon>
            <ListItemText>Visualizar equipe</ListItemText>
          </MenuItem>
        )}
        {permissions.some(
          (permission) => permission.name === "assign_responsible_users",
        ) && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setHierarchyState((prev) => ({ ...prev, selectedUser: null }));
              setModalState({ type: "hierarchy", isOpen: true });
            }}
          >
            <ListItemIcon>
              <GroupAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Adicionar membro</ListItemText>
          </MenuItem>
        )}
        {permissions.some(
          (permission) => permission.name === "unassign_responsible_users",
        ) && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setHierarchyState((prev) => ({
                ...prev,
                desHierarchy: true,
                selectedUser: null,
              }));
              setModalState({ type: "hierarchy", isOpen: true });
            }}
          >
            <ListItemIcon>
              <GroupRemoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remover membro</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <ModalHierarchy
        isOpen={modalState.type === "hierarchy" && modalState.isOpen}
        selectedUser={hierarchyState.selectedUser}
        onClose={() => setModalState({ type: null, isOpen: false })}
        desHierarchy={hierarchyState.desHierarchy}
        setDesHierarchy={(value) =>
          setHierarchyState((prev) => ({ ...prev, desHierarchy: value }))
        }
        viewHierarchy={hierarchyState.viewHierarchy}
        setViewHierarchy={(value) =>
          setHierarchyState((prev) => ({ ...prev, viewHierarchy: value }))
        }
        responsibleHierarchy={hierarchyState.responsible}
      />
      <ModalDelete
        isOpen={modalState.type === "delete" && modalState.isOpen}
        onClose={() => {
          setModalState({ type: null, isOpen: false });
          setDeleteId(null);
        }}
        onConfirm={() => deleteUserMutation.mutate(deleteId)}
      />
      <ModalUser
        selectedUser={userModal.user}
        isOpen={modalState.type === "user" && modalState.isOpen}
        onClose={() => setModalState({ type: null, isOpen: false })}
        viewOnly={userModal.viewOnly}
        data={sortedData}
        setRefresh={() => queryClient.invalidateQueries(["users"])}
      />
      <PageTitle
        title="Usuários"
        icon={<People />}
        subtitle="Administre, edite e remova usuários conforme necessário."
        buttons={
          <>
            {permissions.some(
              (permission) =>
                permission.name === "assign_responsible_users" ||
                permission.name === "unassign_responsible_users",
            ) && (
              <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                variant="contained"
                color="primary"
                startIcon={<PeopleAltOutlined />}
                endIcon={anchorEl ? <ExpandLess /> : <ExpandMore />}
              >
                EQUIPES
              </Button>
            )}
            {permissions.some(
              (permission) => permission.name === "create_users",
            ) && (
              <Button
                onClick={() => {
                  setUserModal({ user: {}, viewOnly: false });
                  setModalState({ type: "user", isOpen: true });
                }}
                variant="contained"
                color="primary"
                startIcon={<Add />}
              >
                NOVO USUÁRIO
              </Button>
            )}
          </>
        }
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
          setPagination((prev) => ({ ...prev, currentPage: 1 }));
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
                  onClick={() => handleSort("name")}
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
                  onClick={() => handleSort("email")}
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
                  onClick={() => handleSort("role.name")}
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
                  display: !company || !isMobile ? undefined : "none",
                }}
              >
                <TableSortLabel
                  active={sortConfig.key === "company.name"}
                  direction={
                    sortConfig.key === "company.name"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={() => handleSort("company.name")}
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
                  onClick={() => handleSort("responsible")}
                >
                  Usuário Responsável
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ padding: 0 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={6} rowSpan={2} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
            {!isFetching && sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>Nenhum usuário encontrado</TableCell>
              </TableRow>
            ) : (
              (!search
                ? sortedData
                : sortedData.filter(
                    (user) =>
                      user.name.toLowerCase().includes(search.toLowerCase()) ||
                      user.email.toLowerCase().includes(search.toLowerCase()) ||
                      user.role?.name
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                      user.company?.name
                        ?.toLowerCase()
                        .includes(search.toLowerCase()),
                  )
              ).map(
                (
                  { name, email, role, company: userCompany, id, responsible },
                  index,
                ) => (
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
                    <TableCell
                      sx={{
                        maxWidth: isMobile ? 100 : 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {" "}
                      {email}{" "}
                    </TableCell>
                    <TableCell sx={{ maxWidth: isMobile ? 5 : 100 }}>
                      {" "}
                      {role?.name}{" "}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: isMobile ? 5 : 100,
                        display: !company || !isMobile ? undefined : "none",
                      }}
                    >
                      {" "}
                      {userCompany?.name || "N/A"}{" "}
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
                      {responsible && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewHierarchy(responsible);
                          }}
                        >
                          <Groups fontSize="small" />
                        </IconButton>
                      )}
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
                ),
              )
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data?.total || 0}
          labelRowsPerPage="Linhas por página"
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.currentPage - 1}
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
