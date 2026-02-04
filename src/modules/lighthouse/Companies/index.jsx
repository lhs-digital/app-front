import {
  Add,
  BusinessCenterOutlined,
  Delete,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
  RemoveRedEye,
  Search,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  Box,
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
  TextField,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalDelete from "../../../components/ModalDelete";
import { useUserState } from "../../../hooks/useUserState";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { formatCpfCnpj } from "../../../services/formatters";
import ModalCompany from "./components/ModalCompany";
import ModalIntegration from "./components/ModalIntegration";

const Companies = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [modalIntegrationOpen, setModalIntegrationOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    rowsPerPage: 5,
  });
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const { permissions } = useUserState().state;

  const { data, isPending, isFetching } = useQuery({
    queryKey: [
      "companies",
      pagination.currentPage,
      pagination.rowsPerPage,
      search,
    ],
    queryFn: async () => {
      const params = {
        page: pagination.currentPage,
        per_page: pagination.rowsPerPage,
        search: search || undefined,
      };

      const response = await api.get("/companies", { params });
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

  const sortedData = useMemo(() => {
    const companies = data?.data || [];
    return [...companies].sort((a, b) => {
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

  const { mutate: deleteCompany } = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["companies"]);
      toast.success("Empresa removida com sucesso!");
      setDeleteOpen(false);
      setDeleteId(null);
    },
    onError: (error) => {
      console.error("Erro ao remover a empresa", error);
      toast.error("Erro ao remover empresa");
    },
  });

  const handleRemove = () => {
    deleteCompany(deleteId);
  };

  const handleEdit = (company) => {
    setDataEdit(company);
    setModalOpen(true);
  };

  const handleView = (id) => {
    navigate(`/empresas/${id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.direction === "asc" && prev.key === key ? "desc" : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <KeyboardArrowUp />
    ) : (
      <KeyboardArrowDown />
    );
  };

  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPagination({
      currentPage: 1,
      rowsPerPage: newRowsPerPage,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalIntegration
        isOpen={modalIntegrationOpen}
        onClose={() => setModalIntegrationOpen(false)}
        setRefresh={() => queryClient.invalidateQueries(["companies"])}
      />
      <ModalCompany
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={sortedData}
        dataEdit={dataEdit}
        setDataEdit={setDataEdit}
        setRefresh={() => queryClient.invalidateQueries(["companies"])}
      />
      <ModalDelete
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleRemove}
      />
      <PageTitle
        title="Empresas"
        icon={<BusinessCenterOutlined />}
        subtitle="Administração e supervisão das informações empresariais"
        buttons={
          permissions.some((per) => per.name === "create_companies") && (
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModalIntegrationOpen(true)}
                startIcon={<SettingsOutlined />}
              >
                CONFIGURAR INTEGRAÇÃO
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => [setDataEdit({}), setModalOpen(true)]}
                startIcon={<Add />}
              >
                NOVA EMPRESA
              </Button>
            </Box>
          )
        }
      />
      <TextField
        fullWidth
        placeholder="Buscar empresa"
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
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Razão Social {getSortIcon("name")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("dba")}
                style={{ cursor: "pointer" }}
              >
                Nome Fantasia {getSortIcon("dba")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("cnpj")}
                style={{ cursor: "pointer" }}
              >
                CNPJ {getSortIcon("cnpj")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("responsible_cpf")}
                style={{ cursor: "pointer" }}
              >
                CPF do Responsável {getSortIcon("responsible_cpf")}
              </TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isPending && (
              <TableRow>
                <TableCell colSpan={5} rowSpan={2} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
            {!isFetching && sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  Não existem empresas cadastradas
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map(
                (
                  {
                    name,
                    cnpj,
                    dba,
                    responsible_cpf,
                    roles_count,
                    address,
                    id,
                    is_super_admin,
                  },
                  index,
                ) => (
                  <TableRow key={index} style={{ cursor: "pointer" }}>
                    <TableCell> {name} </TableCell>
                    <TableCell>
                      {dba || (
                        <span className="text-neutral-500">Não informado</span>
                      )}
                    </TableCell>
                    <TableCell> {formatCpfCnpj(cnpj)} </TableCell>
                    <TableCell> {formatCpfCnpj(responsible_cpf)} </TableCell>
                    <TableCell className="space-x-1">
                      {permissions.some(
                        (permissions) => permissions.name === "view_companies",
                      ) ? (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(id);
                          }}
                        >
                          <RemoveRedEye />
                        </IconButton>
                      ) : null}
                      {permissions.some(
                        (permissions) =>
                          permissions.name === "update_companies",
                      ) ? (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit({
                              name,
                              cnpj,
                              dba,
                              responsible_cpf,
                              roles_count,
                              address,
                              id,
                              index,
                            });
                          }}
                        >
                          <Edit />
                        </IconButton>
                      ) : null}
                      {permissions.some(
                        (permissions) =>
                          permissions.name === "delete_companies",
                      ) ? (
                        <IconButton
                          disabled={is_super_admin}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      ) : null}
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

export default Companies;
