import { Add, Delete, Edit, Search, Visibility } from "@mui/icons-material";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalDelete from "../../components/ModalDelete";
import PageTitle from "../../components/PageTitle";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";
import { qc } from "../../services/queryClient";
import { hasPermission } from "../../services/utils";

const Roles = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const { permissions } = useUserState().state;
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [sortedData, setSortedData] = useState([]);

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["roles", currentPage],
    queryFn: async () => {
      const response = await api.get(
        `/roles?page=${currentPage}&per_page=${rowsPerPage}`,
        {
          params: { search: search },
        },
      );
      setTotalCount(response.data.meta.total);
      return response.data.data;
    },
  });

  const { mutate: deleteRole } = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/roles/${id}`);
    },
    onSuccess: () => {
      toast.success("Role removida com sucesso!");
      setDeleteOpen(false);
      qc.invalidateQueries({ queryKey: ["roles", currentPage] });
    },
    onError: (error) => {
      console.error("Erro ao remover role", error);
    },
  });

  const handleRemove = () => {
    deleteRole(deleteId);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

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
  }, [isSuccess]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalDelete
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleRemove}
      />
      <PageTitle
        title="Papéis e permissões"
        subtitle="Administração e atribuição de permissões e funções de usuários"
        buttons={
          hasPermission(permissions, "create_roles") && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate("/papeis/novo")}
            >
              NOVO CARGO
            </Button>
          )
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
                  sortConfig.key === "company.name"
                    ? sortConfig.direction
                    : false
                }
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
                  sortConfig.key === "permissions_count"
                    ? sortConfig.direction
                    : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "permissions_count"}
                  direction={
                    sortConfig.key === "permissions_count"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("permissions_count")}
                >
                  Qtd Permissões
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
            {sortedData.map(({ name, company, permissions_count, id }) => (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>{company?.name}</TableCell>
                <TableCell>{permissions_count}</TableCell>
                <TableCell sx={{ padding: 0, paddingLeft: 1 }}>
                  {hasPermission(permissions, "view_roles") && (
                    <IconButton onClick={() => navigate(`/papeis/${id}`)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  )}
                  {hasPermission(permissions, "update_roles") && (
                    <IconButton
                      onClick={() =>
                        navigate(`/papeis/${id}`, { state: { edit: true } })
                      }
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                  {hasPermission(permissions, "delete_roles") && (
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

export default Roles;
