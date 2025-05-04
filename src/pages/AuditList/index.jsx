import { FilterList, FilterListOff, List, Search } from "@mui/icons-material";
import Masonry from "@mui/lab/Masonry";
import {
  Autocomplete,
  Badge,
  Box,
  CircularProgress,
  colors,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../components/PageTitle";
import { useThemeMode } from "../../contexts/themeModeContext";
import { useCompany } from "../../hooks/useCompany";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";
import { moduleRoutes } from "../../services/moduleRoutes";
import { qc } from "../../services/queryClient";
import { getPriorityColor, priorities } from "../../services/utils";
import { handleMode } from "../../theme";
import AuditFilters from "./components/AuditFilters";
import AuditItem from "./components/AuditItem";
import AuditWorkOrder from "./components/AuditWorkOrder";

const AuditList = () => {
  const [refresh, setRefresh] = useState(false);
  const theme = handleMode(useThemeMode().mode);
  const [currentFilterCount, setCurrentFilterCount] = useState(1);
  const { company, setCompany, availableCompanies } = useCompany();
  const [table, setTable] = useState("");
  const [workOrderOpen, setWorkOrderOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const { isLighthouse } = useUserState().state;

  const filterDefaults = {
    search: "",
    priorityOrder: "desc",
    createdAt: [null, null],
    status: -1,
    priority: -1,
  };

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 20,
    totalCount: 0,
  });

  const [filters, setFilters] = useState({
    ...filterDefaults,
    status: 0,
  });

  const [appliedFilters, setAppliedFilters] = useState({
    ...filterDefaults,
    status: 0,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const openFilters = Boolean(anchorEl);

  const { data: availableTables = [], isLoading: isTablesLoading } = useQuery({
    queryKey: ["company_tables", company],
    queryFn: async () => {
      const response = await api.get(`/company/auditable_tables`, {
        params: { company_id: company },
      });
      setTable(response.data.data[0]);
      return response.data.data;
    },
    enabled: !!company,
  });

  const { data = [], isLoading } = useQuery({
    queryKey: [
      "audits",
      pagination.currentPage,
      pagination.perPage,
      appliedFilters,
      company?.id,
      table,
    ],

    queryFn: async () => {
      try {
        const response = await api.get("/audit", {
          params: {
            search:
              appliedFilters.search === "" ? undefined : appliedFilters.search,
            status:
              appliedFilters.status === -1 ? undefined : appliedFilters.status,
            priority:
              appliedFilters.priority === -1
                ? undefined
                : appliedFilters.priority,
            created_at:
              appliedFilters.createdAt[0] || appliedFilters.createdAt[1]
                ? [appliedFilters.createdAt[0], appliedFilters.createdAt[1]]
                : undefined,
            priority_order: appliedFilters.priorityOrder,
            page: pagination.currentPage,
            per_page: pagination.perPage,
            company_id: company?.id,
            table: table?.name,
          },
        });

        setPagination((prev) => ({
          ...prev,
          totalCount: response.data.meta.total,
        }));
        return response.data.data;
      } catch (error) {
        toast.error("Erro ao carregar os dados.");
      }
    },
    onError: () => {
      toast.error("Erro ao carregar os dados.");
    },
    enabled: !!company && !!table,
  });

  useEffect(() => {
    if (availableTables.length > 0) {
      setTable(availableTables[0]);
    }
  }, [availableTables]);

  const handleClean = () => {
    setFilters({
      search: "",
      priorityOrder: "desc",
      createdAt: [null, null],
      status: -1,
      priority: -1,
    });
    setAppliedFilters({
      search: "",
      priorityOrder: "desc",
      createdAt: [null, null],
      status: -1,
      priority: -1,
    });
    qc.invalidateQueries(["audits"]);
  };

  const handleSearch = (event) => {
    const value = event.target.value;

    setFilters((prevFilters) => ({
      ...prevFilters,
      search: value || "",
    }));

    if (value.length > 3 || value.length === 0) {
      handleFilter();
    }
  };

  const countActiveFilters = () => {
    let count = 0;
    Object.keys(filters).forEach((key) => {
      if (appliedFilters[key] !== filterDefaults[key]) {
        count += 1;
      }
    });
    setCurrentFilterCount(count);
  };

  const handleFilter = () => {
    setAppliedFilters({
      search: filters.search,
      priorityOrder: filters.priorityOrder,
      priority: filters.priority,
      status: filters.status,
      createdAt: filters.createdAt,
    });

    countActiveFilters();

    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage + 1,
    }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPagination((prev) => ({
      ...prev,
      perPage: newRowsPerPage,
      currentPage: 1,
    }));
  };

  const handleOpenFilterMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setAnchorEl(null);
  };

  const handleWorkOrder = (auditRecord) => {
    console.log("auditRecord", auditRecord);
    if (!table) {
      toast.error("Selecione uma tabela para visualizar os dados.");
      return;
    }

    setWorkOrderOpen(true);
    setSelectedItem(auditRecord);
  };

  const handleView = (auditRecord) => {
    console.log("auditRecord", auditRecord);
    const navigateRoute = [];

    navigateRoute.push(moduleRoutes[table?.name]);
    navigateRoute.push(auditRecord?.record_id);
    console.log("navigateRoute", navigateRoute);

    return navigate(`/${navigateRoute.join("/")}`, {
      state: {
        edit: true,
        columns: auditRecord?.columns,
        recordId: Number(auditRecord?.id),
        status: auditRecord?.status,
        companyId: company?.id,
      },
    });
  };

  const renderAuditContent = () => {
    if (isLighthouse && !company) {
      return (
        <div className="p-8 lg:py-12">
          <p className="text-lg text-center text-gray-500">
            Selecione uma empresa para visualizar as atividades.
          </p>
        </div>
      );
    }

    if (!table) {
      return (
        <div className="p-8 lg:py-12">
          <p className="text-lg text-center text-gray-500">
            Selecione uma tabela para visualizar as atividades.
          </p>
        </div>
      );
    }

    if (isLoading || isTablesLoading) {
      return (
        <div className="w-full min-h-80 flex items-center justify-center">
          <CircularProgress />
        </div>
      );
    }

    if (data?.length === 0) {
      return (
        <div className="p-8 lg:py-12">
          <p className="text-lg text-center text-gray-500">
            Não há atividades pendentes ou concluídas.
          </p>
        </div>
      );
    }

    return (
      <Box className="w-full flex flex-col items-center px-2 py-4 border rounded-md lg:min-h-80">
        <Masonry
          columns={{
            xs: 1,
            lg: 2,
            xl: 3,
          }}
          spacing={2}
          width="100%"
        >
          {data.map((item) => (
            <AuditItem
              key={item.id}
              auditRecord={item}
              setRefresh={setRefresh}
              refresh={refresh}
              onClick={() => handleWorkOrder(item)}
            />
          ))}
        </Masonry>
      </Box>
    );
  };

  return (
    <div className="flex flex-col w-full gap-6 items-center">
      <PageTitle
        icon={<List fontSize="small" />}
        title="Lista de Atividades"
        subtitle="Gerencie todas as suas atividades pendentes e concluídas."
      />
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <TextField
          fullWidth
          className="grow"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          placeholder="Pesquise por ID do cliente, campo, valor ou mensagem."
          value={filters.search}
          onChange={handleSearch}
        />
        <div className="w-full lg:w-1/3">
          <FormControl fullWidth size="small">
            <InputLabel id="table-select">Tabela</InputLabel>
            <Select
              fullWidth
              labelId="table-select"
              className="capitalize"
              value={table}
              label="Tabela"
              onChange={(e) => setTable(e.target.value)}
              size="small"
            >
              {availableTables.map((table) => (
                <MenuItem key={table.id} value={table} className="capitalize">
                  {table.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {isLighthouse && (
          <div className="w-full lg:w-1/3">
            <Autocomplete
              value={company}
              noOptionsText="Nenhuma empresa encontrada."
              options={availableCompanies}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.id}
              loadingText="Carregando..."
              renderInput={(params) => (
                <TextField {...params} label="Empresa" size="small" />
              )}
              onChange={(e, newValue) => setCompany(newValue)}
            />
          </div>
        )}
        <div className="grow lg:shrink gap-4 flex flex-row col-span-2">
          <Tooltip title="Filtrar" aria-label="Filtrar">
            <Badge badgeContent={currentFilterCount} color="primary">
              <IconButton
                className="aspect-square"
                onClick={handleOpenFilterMenu}
                size="small"
              >
                <FilterList fontSize="small" />
              </IconButton>
            </Badge>
          </Tooltip>
          <Tooltip title="Limpar filtros" aria-label="Limpar filtros">
            <IconButton
              className="aspect-square"
              onClick={handleClean}
              size="small"
            >
              <FilterListOff fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <AuditFilters
        open={openFilters}
        anchorEl={anchorEl}
        filters={filters}
        onClose={handleCloseFilterMenu}
        onFilterChange={(field, value) =>
          setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
          }))
        }
        onApplyFilters={handleFilter}
        onCleanFilters={handleClean}
      />
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
      {renderAuditContent()}
      <AuditWorkOrder
        open={workOrderOpen}
        onClose={() => setWorkOrderOpen(false)}
        handleView={handleView}
        auditRecord={selectedItem}
      />
      <Box display="flex" justifyContent="flex-end" width="100%">
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={pagination.totalCount}
          labelRowsPerPage="Linhas por página"
          rowsPerPage={pagination.perPage}
          page={pagination.currentPage - 1}
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

export default AuditList;
