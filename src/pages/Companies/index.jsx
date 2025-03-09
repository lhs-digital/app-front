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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ModalCompany from "../../components/ModalCompany";
import ModalDelete from "../../components/ModalDelete";
import ModalViewCompany from "../../components/ModalViewCompany";
import PageTitle from "../../components/PageTitle";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";

const Companies = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
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

  const { permissions } = useUserState().userState;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/companies?page=${currentPage}&per_page=${rowsPerPage}`,
          {
            params: {
              search: search,
            },
          },
        );
        setCurrentPage(response.data.meta.current_page);
        setData(response.data.data);
        setTotalCount(response.data.meta.total);
      } catch (error) {
        console.error("Erro ao verificar lista de empresas", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [setData, currentPage, search, refresh]);

  const handleRemove = async () => {
    try {
      await api.delete(`/companies/${deleteId}`);
      setRefresh(!refresh);
      toast.success("Empresa removida com sucesso!");
      setDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao remover a empresa", error);
    }
  };

  const handleEdit = (company) => {
    setDataEdit(company);
    setModalOpen(true);
  };

  const handleView = (index) => {
    const selectedUser = data;
    setDataView(selectedUser[index]);
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
      <KeyboardArrowUp />
    ) : (
      <KeyboardArrowDown />
    );
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
      <ModalCompany
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        setData={setData}
        dataEdit={dataEdit}
        setDataEdit={setDataEdit}
        setRefresh={setRefresh}
        refresh={refresh}
      />
      <ModalDelete
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleRemove}
      />
      <ModalViewCompany
        selectedCompany={dataView}
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
      />
      <PageTitle
        title="Empresas"
        subtitle="Administração e supervisão das informações empresariais"
        buttons={
          permissions.some((per) => per.name === "create_companies") && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => [setDataEdit({}), setModalOpen(true)]}
              startIcon={<Add />}
            >
              NOVA EMPRESA
            </Button>
          )
        }
      />
      <TextField
        fullWidth
        placeholder="Buscar empresa"
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
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  Não existem empresas cadastradas
                </TableCell>
              </TableRow>
            ) : (
              data.map(
                (
                  {
                    name,
                    cnpj,
                    dba,
                    responsible_cpf,
                    roles_count,
                    address,
                    id,
                  },
                  index,
                ) => (
                  <TableRow
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleView(index)}
                  >
                    <TableCell> {name} </TableCell>
                    <TableCell> {dba} </TableCell>
                    <TableCell> {cnpj} </TableCell>
                    <TableCell> {responsible_cpf} </TableCell>
                    <TableCell sx={{ padding: 0, paddingLeft: 1 }}>
                      {permissions.some(
                        (permissions) =>
                          permissions.name === "update_companies",
                      ) ? (
                        <IconButton
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

export default Companies;
