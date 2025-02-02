import { Search } from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";
import {
  Box,
  Button,
  ButtonGroup,
  colors,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import ActivitieItem from "../../components/ActivitieItem/ActivitieItem";
import PageTitle from "../../components/PageTitle";
import Pagination from "../../components/Pagination";
import api from "../../services/api";
import { getPriorityColor, priorities } from "../../services/utils";

const ListActivities = () => {
  const [data, setData] = useState([]);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [table, setTable] = useState("clients");
  const [priorityOrder, setPriorityOrder] = useState("desc");
  const [status, setStatus] = useState(0);
  const [createdAt, setCreatedAt] = useState([]);
  const [per_page, setPer_page] = useState(20);
  const [priority, setPriority] = useState("");

  const isMobile = useMediaQuery("(max-width: 600px)");

  const [filterParams, setFilterParams] = useState({
    search: "",
    priorityOrder: "desc",
    createdAt: [],
    status: null,
    priority: null,
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
              // priority_order: "",
              ...(status !== null && { status: status }),
              // priority: "",
              created_at: [
                filterParams?.createdAt[0],
                filterParams?.createdAt[1],
              ],
            },
          },
        );

        setCurrentPage(response.data.meta.current_page);
        setLastPage(response.data.meta.last_page);
        setData(response.data.data);
      } catch (error) {
        console.error("Erro ao filtrar as tasks", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [currentPage, refresh, filterParams, per_page, status]);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setFilterParams((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handlePriorityOrder = (event) => {
    const newOrder = event.target.value;
    setPriorityOrder(newOrder);
    setFilterParams({
      search: "",
      status: null,
      priorityOrder: newOrder,
      priority: null,
      createdAt: [],
    });
  };

  const handleClean = () => {
    setSearch("");
    setTable("");
    setPriorityOrder("desc");
    setCreatedAt([null, null]);
    setFilterParams({
      search: "",
      priorityOrder: "desc",
      status: null,
      priority: null,
      createdAt: [],
    });
    setCurrentPage(1);
    setRefresh(!refresh);
  };

  const handleFilter = () => {
    setFilterParams({
      search,
      priorityOrder,
      priority,
      status: null,
      createdAt,
    });

    setCurrentPage(1);
    setRefresh(!refresh);
  };

  const handlePerPageChange = (e) => {
    setPer_page(e.target.value);
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <PageTitle
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
          <InputLabel>Ordem de Prioridade:</InputLabel>
          <Select
            value={priorityOrder}
            onChange={handlePriorityOrder}
            fullWidth
          >
            <MenuItem value="desc">Decrescente</MenuItem>
            <MenuItem value="asc">Crescente</MenuItem>
          </Select>
        </Box>
        <Box className="col-span-1">
          <InputLabel>Status:</InputLabel>
          <Select value={status} onChange={handleStatusChange} fullWidth>
            <MenuItem value={null}>Todos</MenuItem>
            <MenuItem value={0}>Pendentes</MenuItem>
            <MenuItem value={1}>Concluídas</MenuItem>
          </Select>
        </Box>
        <Box className="col-span-1">
          <InputLabel>Prioridade:</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            fullWidth
          >
            <MenuItem value={""}>Todas</MenuItem>
            <MenuItem value={1}>Muito Baixa</MenuItem>
            <MenuItem value={2}>Baixa</MenuItem>
            <MenuItem value={3}>Urgente</MenuItem>
          </Select>
        </Box>
        <Box className="col-span-2">
          <InputLabel>Paginação:</InputLabel>
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
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" alignSelf="end" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              width="12px"
              height="12px"
              borderRadius="30%"
              bgcolor={colors.orange[100]}
            />
            <p className="text-sm">Atividade Pendente</p>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              width="12px"
              height="12px"
              borderRadius="30%"
              bgcolor={colors.green[100]}
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
                  backgroundColor: getPriorityColor(item.value).color,
                }}
              />
              <p className="text-sm">Prioridade {item.label}</p>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="w-full flex flex-col items-center px-2 py-4 border rounded-md">
        <Masonry columns={isMobile ? 1 : 2} spacing={2} width="100%">
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
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ListActivities;
