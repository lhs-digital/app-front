import { List, Search } from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";
import {
  Box,
  Button,
  ButtonGroup,
  colors,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import ActivitieItem from "../../components/ActivitieItem/ActivitieItem";
import PageTitle from "../../components/PageTitle";
import { useThemeMode } from "../../contexts/themeModeContext";
import api from "../../services/api";
import { getPriorityColor, priorities } from "../../services/utils";
import { handleMode } from "../../theme";

const ListActivities = () => {
  const [data, setData] = useState([]);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [table, setTable] = useState("clients");
  const [priorityOrder, setPriorityOrder] = useState("desc");
  const [status, setStatus] = useState(0);
  const [createdAt, setCreatedAt] = useState([]);
  const [per_page, setPer_page] = useState(20);
  const [priority, setPriority] = useState(-1);
  const [totalCount, setTotalCount] = useState(0);
  const theme = handleMode(useThemeMode().mode);

  const [filterParams, setFilterParams] = useState({
    search: "",
    priorityOrder: "desc",
    createdAt: [],
    status: -1,
    priority: -1,
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/auditing?page=${currentPage}&per_page=${per_page}`,
          {
            params: {
              search: filterParams?.search,
              priority_order: "",
              status: status === -1 ? undefined : status,
              priority: priority === -1 ? undefined : priority,
              created_at: [
                filterParams?.createdAt[0],
                filterParams?.createdAt[1],
              ],
            },
          },
        );

        setCurrentPage(response.data.meta.current_page);
        setData(response.data.data);
        console.log("response", response.data.data);
        setTotalCount(response.data.meta.total);
      } catch (error) {
        console.error("Erro ao filtrar as tasks", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [currentPage, refresh, filterParams, per_page]);

  const handleClean = () => {
    setSearch("");
    setTable("clients");
    setPriorityOrder("desc");
    setCreatedAt([null, null]);
    setPriority(-1);
    setStatus(-1);
    setFilterParams({
      search: "",
      priorityOrder: "desc",
      createdAt: [],
      status: -1,
      priority: -1,
    });
    setCurrentPage(1);
    setRefresh((prev) => !prev);
  };

  const handleFilter = () => {
    setFilterParams({
      search,
      priorityOrder,
      priority,
      status,
      createdAt,
    });

    setCurrentPage(1);
  };

  const handlePerPageChange = (e) => {
    setPer_page(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPer_page(newRowsPerPage);
    setCurrentPage(1);
    setRefresh((prev) => !prev);
  };

  return (
    <div className="flex flex-col w-full gap-6 items-center">
      <PageTitle
        icon={<List fontSize="small" />}
        title="Lista de Atividades"
        subtitle="Gerencie todas as suas atividades pendentes e concluídas."
      />
      <Box className="border rounded-md p-4 grid grid-cols-8 w-full gap-4">
        <Box className="col-span-1">
          <InputLabel>Tabela</InputLabel>
          <Select
            fullWidth
            value={table}
            onChange={(e) => setTable(e.target.value)}
          >
            <MenuItem value="clients">clients</MenuItem>
          </Select>
        </Box>
        <Box className="col-span-4">
          <InputLabel>Pesquise por</InputLabel>
          <TextField
            fullWidth
            startAdornment={<Search />}
            placeholder="ID do cliente, Campo inválido, Valor do campo inválido e Mensagem de erro"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
        <Box className="col-span-3">
          <InputLabel>Data da Auditoria</InputLabel>
          <Box display="flex" alignItems="center" gap="6px">
            <TextField
              placeholder="Data de Auditoria"
              type="date"
              fullWidth
              value={createdAt[0] || ""}
              onChange={(e) => setCreatedAt([e.target.value, createdAt[1]])}
            />
            até
            <TextField
              placeholder="Data de Auditoria"
              type="date"
              fullWidth
              value={createdAt[1] || ""}
              onChange={(e) => setCreatedAt([createdAt[0], e.target.value])}
            />
          </Box>
        </Box>
        <Box className="col-span-2">
          <InputLabel>Ordem de Prioridade</InputLabel>
          <Select
            value={priorityOrder}
            onChange={(e) => setPriorityOrder(e.target.value)}
            fullWidth
          >
            <MenuItem value="desc">Decrescente</MenuItem>
            <MenuItem value="asc">Crescente</MenuItem>
          </Select>
        </Box>
        <Box className="col-span-1">
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          >
            <MenuItem value={-1}>Todos</MenuItem>
            <MenuItem value={0}>Pendentes</MenuItem>
            <MenuItem value={1}>Concluídas</MenuItem>
          </Select>
        </Box>
        <Box className="col-span-1">
          <InputLabel>Prioridade</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
          >
            <MenuItem value={-1}>Todas</MenuItem>
            <MenuItem value={3}>Urgente</MenuItem>
            <MenuItem value={2}>Moderada</MenuItem>
            <MenuItem value={1}>Baixa</MenuItem>
          </Select>
        </Box>
        <Box className="col-span-2">
          <InputLabel>Paginação</InputLabel>
          <Select value={per_page} fullWidth onChange={handlePerPageChange}>
            <MenuItem value={10}>10 por página</MenuItem>
            <MenuItem value={20}>20 por página</MenuItem>
            <MenuItem value={30}>30 por página</MenuItem>
            <MenuItem value={50}>50 por página</MenuItem>
          </Select>
        </Box>
        <Box className="col-span-2">
          <InputLabel>Ações</InputLabel>
          <ButtonGroup variant="outlined" color="info" fullWidth>
            <Button className="h-14" onClick={handleClean}>
              Limpar
            </Button>
            <Button onClick={handleFilter}>Filtrar</Button>
          </ButtonGroup>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width={"100%"}
        gap={2}
        mt={2}
      >
        <Box display="flex" alignItems="center" alignSelf="end" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              width="12px"
              height="12px"
              borderRadius="30%"
              bgcolor={colors.orange[theme === "light" ? 100 : 500]}
            />
            <p className="text-sm">Atividade Pendente</p>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              width="12px"
              height="12px"
              borderRadius="30%"
              bgcolor={colors.green[theme === "light" ? 100 : 500]}
            />
            <p className="text-sm">Atividade Concluída</p>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" alignSelf="end" gap={2}>
          {priorities.map((item) => (
            <Box key={item.label} display="flex" alignItems="center" gap={1}>
              <Box
                width="12px"
                height="12px"
                borderRadius="30%"
                sx={{
                  backgroundColor: getPriorityColor(item.value, theme)[
                    theme === "light" ? "color" : "backgroundColor"
                  ],
                }}
              />
              <p className="text-sm">Prioridade {item.label}</p>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="w-full flex flex-col items-center px-2 py-4 border rounded-md">
        <Masonry
          columns={{
            xs: 1,
            lg: 2,
            xl: 3,
          }}
          spacing={2}
          width="100%"
        >
          {data?.length === 0 ? (
            <p>Não há tasks</p>
          ) : (
            data.map((item) => (
              <ActivitieItem
                key={item.id}
                activitie={item}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            ))
          )}
        </Masonry>
      </Box>
      <Box display="flex" justifyContent="flex-end" width="100%">
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={totalCount}
          labelRowsPerPage="Linhas por página"
          rowsPerPage={per_page}
          page={currentPage - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </Box>
    </div>
  );
};

export default ListActivities;
