import {
  Add,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Lock,
  Search,
} from "@mui/icons-material";
import {
  Box,
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
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DockerIcon from "../../../components/Miscellaneous/DockerIcon.jsx";
import ModalDelete from "../../../components/ModalDelete";
import { useUserState } from "../../../hooks/useUserState";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";

const Vpns = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const { permissions } = useUserState().state;

  const {
    data: fetchedData,
    isLoading,
    status,
    refetch,
  } = useQuery({
    queryKey: ["vpns", currentPage, rowsPerPage, search, refresh],
    queryFn: async () => {
      return await api.get(
        `/vpns?page=${currentPage}&per_page=${rowsPerPage}`,
        {
          params: {
            search: search,
          },
        },
      );
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    if (status === "success") {
      setCurrentPage(fetchedData.data.meta.current_page);
      setData(fetchedData.data.data);
      setTotalCount(fetchedData.data.meta.total);
    }
  }, [status, fetchedData]);

  const handleRemove = async () => {
    try {
      await api.delete(`/vpns/${deleteId}`);
      toast.success("VPN removida com sucesso!");
      setDeleteOpen(false);
      refetch();
    } catch (error) {
      toast.error("Erro ao remover a VPN", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.direction === "asc" && sortConfig.key === key ? "desc" : "asc";

    const sortedData = fetchedData.sort((a, b) => {
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

  const handleDockerConfig = async (id, name) => {
    toast.promise(
      async () => {
        const response = await api.get(`/vpns/${id}/docker_config`);
        const fileName = `${new Date().toISOString().split("T")[0]}-${name.toLowerCase().replace(/ /g, "-")}-compose.yml`;
        const file = new File([response.data], fileName, {
          type: "text/plain",
        });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
      },
      {
        pending: "Adquirindo arquivo de configuração...",
        success: "Arquivo de configuração baixado com sucesso",
        error: "Erro ao baixar arquivo de configuração",
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <ModalDelete
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleRemove}
      />
      <PageTitle
        title="VPNs"
        icon={<Lock />}
        subtitle="Administração e controle das conexões VPN da empresa"
        buttons={
          permissions.some((per) => per.name === "create_companies") && (
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/vpns/nova")}
                startIcon={<Add />}
              >
                NOVA VPN
              </Button>
            </Box>
          )
        }
      />
      <TextField
        fullWidth
        placeholder="Buscar VPN"
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
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Nome {getSortIcon("name")}
              </TableCell>
              <TableCell
                onClick={() => handleSort("company.name")}
                style={{ cursor: "pointer" }}
              >
                Empresa {getSortIcon("company.name")}
              </TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  Carregando...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  Não há VPNs cadastradas
                </TableCell>
              </TableRow>
            ) : (
              data.map((vpn, index) => (
                <TableRow key={index} style={{ cursor: "pointer" }}>
                  <TableCell> {vpn.name} </TableCell>
                  <TableCell> {vpn.company?.name} </TableCell>
                  <TableCell className="space-x-1">
                    <Tooltip title="Baixar arquivo de configuração">
                      <IconButton
                        size="small"
                        onClick={() => handleDockerConfig(vpn.id, vpn.name)}
                      >
                        <DockerIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    {permissions.some(
                      (permissions) => permissions.name === "delete_companies",
                    ) ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(vpn.id);
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

export default Vpns;
