import { FilterAlt, FilterAltOff, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import api from "../../services/api";
import { dateFormatted, defaultLabelDisplayedRows } from "../../services/utils";

const Logs = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [lastPage, setLastPage] = useState(null);
  const [createdAt, setCreatedAt] = useState([]);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  //eslint-disable-next-line
  const [table, setTable] = useState("");
  const [method, setMethod] = useState("");
  const [nivel, setNivel] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "asc",
  });

  const [filterParams, setFilterParams] = useState({
    search: "",
    method: "",
    createdAt: [],
    nivel: "",
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const params = {
          search: filterParams?.search || undefined,
          method: filterParams?.method || undefined,
          nivel: filterParams?.nivel || undefined,
          created_at:
            filterParams?.createdAt && filterParams?.createdAt.length > 0
              ? [filterParams.createdAt[0], filterParams.createdAt[1]]
              : undefined,
        };

        const filteredParams = Object.fromEntries(
          //eslint-disable-next-line
          Object.entries(params).filter(([_, v]) => v !== undefined),
        );

        const response = await api.get(`/logs?page=${currentPage}`, {
          params: filteredParams,
        });

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
  }, [currentPage, refresh, filterParams]);

  const handleClean = () => {
    setSearch("");
    setTable("");
    setCreatedAt([null, null]);
    setFilterParams({
      search: "",
      method: "",
      nivel: "",
      createdAt: [],
    });
    setCurrentPage(1);
    setRefresh(!refresh);
  };

  const handleFilter = () => {
    setFilterParams({
      search,
      method,
      nivel,
      createdAt,
    });

    setCurrentPage(1);
    setRefresh(!refresh);
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

  const createSortHandler = (key) => () => {
    handleSort(key);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <PageTitle
        title="Logs do Sistema"
        subtitle="Registro detalhado de atividades e eventos do sistema"
      />
      <Box display="flex" alignItems="center" gap={2}>
        <Box flexGrow={1}>
          <InputLabel>Tabela</InputLabel>
          <Select fullWidth>
            <MenuItem value="clients">clients</MenuItem>
          </Select>
        </Box>
        <Box flexGrow={1}>
          <InputLabel>Operação</InputLabel>
          <Select
            fullWidth
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="GET">GET</MenuItem>
          </Select>
        </Box>
        <Box flexGrow={1}>
          <InputLabel>Nível</InputLabel>
          <Select
            fullWidth
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </Box>
        <Box flexBasis="50%">
          <InputLabel>Período</InputLabel>
          <Box display="flex" alignItems="center" gap="6px">
            <TextField
              type="date"
              value={createdAt[0] || ""}
              onChange={(e) => setCreatedAt([e.target.value, createdAt[1]])}
              fullWidth
            />
            até
            <TextField
              type="date"
              value={createdAt[1] || ""}
              onChange={(e) => setCreatedAt([createdAt[0], e.target.value])}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
            />
          </Box>
        </Box>
      </Box>

      <Box display="flex" gap={2} alignItems="end">
        <Box flexGrow={1}>
          <InputLabel>Pesquise por:</InputLabel>
          <TextField
            fullWidth
            placeholder="IP, tipo e URL"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <ButtonGroup className="h-14">
          <Button onClick={handleClean} startIcon={<FilterAltOff />}>
            Limpar
          </Button>
          <Button
            color="primary"
            onClick={handleFilter}
            startIcon={<FilterAlt />}
          >
            Filtrar
          </Button>
        </ButtonGroup>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sortDirection={
                  sortConfig.key === "created_at" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "created_at"}
                  direction={
                    sortConfig.key === "created_at"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("created_at")}
                >
                  Data de Registro
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "log.ip" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "log.ip"}
                  direction={
                    sortConfig.key === "log.ip" ? sortConfig.direction : "asc"
                  }
                  onClick={createSortHandler("log.ip")}
                >
                  Endereço IP
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "log.email" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "log.email"}
                  direction={
                    sortConfig.key === "log.email"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("log.email")}
                >
                  E-mail
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "log.user" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "log.user"}
                  direction={
                    sortConfig.key === "log.user" ? sortConfig.direction : "asc"
                  }
                  onClick={createSortHandler("log.user")}
                >
                  Usuário
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "log.method" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "log.method"}
                  direction={
                    sortConfig.key === "log.method"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("log.method")}
                >
                  Operação
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "log.nivel" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "log.nivel"}
                  direction={
                    sortConfig.key === "log.nivel"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("log.nivel")}
                >
                  Nível
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "log.type" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "log.type"}
                  direction={
                    sortConfig.key === "log.type" ? sortConfig.direction : "asc"
                  }
                  onClick={createSortHandler("log.type")}
                >
                  Tipo
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "log.url" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "log.url"}
                  direction={
                    sortConfig.key === "log.url" ? sortConfig.direction : "asc"
                  }
                  onClick={createSortHandler("log.url")}
                >
                  URL
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={
                  sortConfig.key === "log.table" ? sortConfig.direction : false
                }
              >
                <TableSortLabel
                  active={sortConfig.key === "log.table"}
                  direction={
                    sortConfig.key === "log.table"
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={createSortHandler("log.table")}
                >
                  Tabela
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} textAlign="center">
                  Não existem Regras de Auditorias no sistema
                </TableCell>
              </TableRow>
            ) : (
              (!search
                ? data
                : data.filter(
                    (log) =>
                      log?.ip?.includes(search) ||
                      log?.email?.includes(search) ||
                      log?.nivel?.includes(search) ||
                      log?.type?.includes(search) ||
                      log?.method?.includes(search) ||
                      log?.url?.includes(search) ||
                      log?.table?.includes(search) ||
                      log?.object_id?.includes(search) ||
                      log?.created_at?.includes(search),
                  )
              ).map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{dateFormatted(log.created_at)}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.email}</TableCell>
                  <TableCell>{log.object_id}</TableCell>
                  <TableCell>{log.method}</TableCell>
                  <TableCell>{log.nivel}</TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.url}</TableCell>
                  <TableCell>{log.table}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={lastPage * 10}
          page={currentPage - 1}
          onPageChange={(event, newPage) => setCurrentPage(newPage + 1)}
          labelRowsPerPage="Linhas por página"
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          labelDisplayedRows={defaultLabelDisplayedRows}
        />
      </TableContainer>
    </div>
  );
};

export default Logs;
