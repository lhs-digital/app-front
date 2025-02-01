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
import ModalCompany from "../../components/ModalCompany";
import ModalDelete from "../../components/ModalDelete";
import ModalViewCompany from "../../components/ModalViewCompany";
import PageTitle from "../../components/PageTitle";
import { AuthContext } from "../../contexts/auth";
import api from "../../services/api";

const Companies = () => {
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
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { permissions } = useContext(AuthContext);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/companies?page=${currentPage}&per_page=${rowsPerPage}`);
        setCurrentPage(response.data.meta.current_page);
        setLastPage(response.data.meta.last_page);
        setData(response.data.data);
      } catch (error) {
        console.error("Erro ao verificar lista de usuários", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [setData, currentPage, lastPage, refresh]);

  const handleRemove = async () => {
    try {
      await api.delete(`/companies/${deleteId}`);
      setRefresh(!refresh);
      toast.success("Empresa removida com sucesso!");
      setDeleteOpen(false);
    } catch (error) {
      console.error("Erro ao verificar lista de usuários", error);
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
        title="Gerenciamento de Empresas"
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
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                Nome {getSortIcon("name")}
              </TableCell>
              <TableCell onClick={() => handleSort("cnpj")} style={{ cursor: "pointer" }}>
                CNPJ {getSortIcon("cnpj")}
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
              (!search
                ? data
                : data.filter(
                    (company) =>
                      company.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      company.cnpj.toLowerCase().includes(search.toLowerCase()),
                  )
              ).map(({ name, cnpj, roles_count, id }, index) => (
                <TableRow
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleView(index)}
                >
                  <TableCell> {name} </TableCell>
                  <TableCell> {cnpj} </TableCell>
                  <TableCell>
                    {permissions.some(
                      (permissions) => permissions.name === "update_companies",
                    ) ? (
                      <IconButton
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleEdit({ name, cnpj, roles_count, id, index });
                        }}
                      >
                        <Edit />
                      </IconButton>
                    ) : null}
                    {permissions.some(
                      (permissions) => permissions.name === "update_companies",
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
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={lastPage * rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página"
        />
      </TableContainer>
    </div>
  );
};

export default Companies;
