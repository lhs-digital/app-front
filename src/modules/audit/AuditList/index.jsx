import {
  AssignmentLate,
  FileOpenOutlined,
  FilterList,
  PlayCircleOutline,
  Search,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import {
  filterDefaults,
  useAuditFilters,
} from "../../../hooks/useAuditFilters";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";

import AuditContent from "./components/AuditContent";
import AuditFilters from "./components/AuditFilters";
import AuditItemModal from "./components/AuditItemModal";

const AuditList = () => {
  const [refresh, setRefresh] = useState(false);
  const [currentFilterCount, setCurrentFilterCount] = useState(0);
  const { company } = useCompany();
  // const [workOrderOpen, setWorkOrderOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // const { isLighthouse } = useUserState().state;

  const { filters, updateFilters, resetFilters, searchParams } =
    useAuditFilters();

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams(searchParams);
    let count = -1;
    for (const key of params.keys()) {
      if (Object.prototype.hasOwnProperty.call(filterDefaults, key)) {
        if (params.get(key) !== filterDefaults[key]) {
          count++;
        }
      }
    }
    setCurrentFilterCount(count);
  }, [searchParams]);

  const [anchorEl, setAnchorEl] = useState(null);
  const openFilters = Boolean(anchorEl);

  const { data: availableModules = [], isLoading: isModulesLoading } = useQuery(
    {
      queryKey: ["company_tables", company],
      queryFn: async () => {
        const response = await api.get(
          `/companies/${company.id}/audit/modules`,
        );
        const modules = response.data.data;
        console.log("modules", modules);
        console.log("filters.moduleId", filters.moduleId);
        if (modules.length > 0 && !filters.moduleId) {
          updateFilters({ moduleId: modules[0].id });
        }
        return modules;
      },
      enabled: !!company,
    },
  );

  const { data = [], isLoading } = useQuery({
    queryKey: [
      "audits",
      filters.page,
      filters.perPage,
      JSON.stringify(filters),
      company?.id,
    ],
    queryFn: async () => {
      try {
        const response = await api.get(`/companies/${company.id}/audit`, {
          params: {
            search: filters.search === "" ? undefined : filters.search,
            status: filters.status === -1 ? undefined : filters.status,
            priority: filters.priority === -1 ? undefined : filters.priority,
            created_at:
              filters.createdAt[0] || filters.createdAt[1]
                ? [filters.createdAt[0], filters.createdAt[1]]
                : undefined,
            priority_order: filters.priorityOrder,
            page: filters.page,
            per_page: filters.perPage,
            module: filters.moduleId,
          },
        });

        return response.data.data;
      } catch (error) {
        toast.error("Erro ao carregar os dados.");
      }
    },
    onError: () => {
      toast.error("Erro ao carregar os dados.");
    },
    enabled: !!company && !!filters.moduleId,
  });

  const handleSearch = (event) => {
    const value = event.target.value;

    if (value.length > 3 || value.length === 0) {
      updateFilters({ search: value });
    }
  };

  const handleChangePage = (event, newPage) => {
    updateFilters({ page: newPage + 1 });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    updateFilters({ perPage: newRowsPerPage, page: 1 });
  };

  const handleOpenFilterMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setAnchorEl(null);
  };

  // const handleWorkOrder = (auditRecord) => {
  //   console.log("auditRecord", auditRecord);
  //   if (!filters.module) {
  //     toast.error("Selecione um módulo para visualizar os dados.");
  //     return;
  //   }

  //   setWorkOrderOpen(true);
  //   setSelectedItem(auditRecord);
  // };

  const handleView = (record) => {
    setSelectedItem(record);
  };

  const { mutate: downloadReport, isPending: isDownloading } = useMutation({
    mutationFn: async () => {
      const response = await api.get(
        `/companies/${company.id}/audit/download_report`,
        {
          params: {
            search: filters.search === "" ? undefined : filters.search,
            status: filters.status === -1 ? undefined : filters.status,
            priority: filters.priority === -1 ? undefined : filters.priority,
            created_at:
              filters.createdAt[0] || filters.createdAt[1]
                ? [filters.createdAt[0], filters.createdAt[1]]
                : undefined,
            priority_order: filters.priorityOrder,
            page: filters.page,
            per_page: filters.perPage,
            module: filters.moduleId,
          },
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf",
          },
        },
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");
      if (newWindow) {
        newWindow.onload = () => {
          URL.revokeObjectURL(url);
        };
      }
    },
  });

  const { mutate: startingAudit, isPending: isStarting } = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/companies/${company.id}/audit`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Auditoria iniciada com sucesso.");
      setRefresh((prev) => !prev);
    },
    onError: () => {
      toast.error("Erro ao iniciar a auditoria.");
    },
  });

  return (
    <div className="flex flex-col w-full gap-6 items-center">
      <PageTitle
        icon={<AssignmentLate fontSize="small" />}
        buttons={[
          <Tooltip
            key="start-audit"
            title={`Iniciar auditoria manualmente da empresa atual: ${company?.name}`}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={startingAudit}
              loading={isStarting}
              startIcon={<PlayCircleOutline />}
            >
              Iniciar Auditoria
            </Button>
          </Tooltip>,
          <Tooltip
            title="Baixar relatório com a seleção e filtros atuais"
            key="download-report"
            arrow
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<FileOpenOutlined />}
              onClick={downloadReport}
              loading={isDownloading}
            >
              Exportar relatório
            </Button>
          </Tooltip>,
        ]}
        title="Itens auditados"
        subtitle="Gerencie todas as suas atividades pendentes e concluídas."
      />
      <div className="flex flex-col lg:flex-row w-full gap-4 items-center">
        <TextField
          fullWidth
          className="grow"
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
          defaultValue={filters.search}
          onChange={handleSearch}
        />
        <div className="w-full lg:w-1/3">
          <FormControl fullWidth>
            <InputLabel id="table-select">Módulo</InputLabel>
            <Select
              fullWidth
              labelId="table-select"
              className="capitalize"
              value={filters.moduleId || ""}
              label="Módulo"
              onChange={(e) => updateFilters({ moduleId: e.target.value })}
            >
              {availableModules.map((module) => (
                <MenuItem
                  key={module.id}
                  value={module.id}
                  className="capitalize"
                >
                  {module.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* {isLighthouse && (
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
        )} */}
        <Tooltip title="Filtrar" aria-label="Filtrar">
          <Badge
            badgeContent={!isModulesLoading && currentFilterCount}
            color="primary"
          >
            <IconButton
              onClick={handleOpenFilterMenu}
              className="h-[52px] w-[52px]"
            >
              {isModulesLoading ? (
                <CircularProgress size={16} />
              ) : (
                <FilterList fontSize="small" />
              )}
            </IconButton>
          </Badge>
        </Tooltip>
      </div>
      <AuditFilters
        open={openFilters}
        anchorEl={anchorEl}
        filters={filters}
        onClose={handleCloseFilterMenu}
        onFilterChange={(field, value) => updateFilters({ [field]: value })}
        onApplyFilters={handleCloseFilterMenu}
        onCleanFilters={resetFilters}
      />
      <AuditContent
        isLoading={isLoading || isModulesLoading}
        data={data}
        setRefresh={setRefresh}
        refresh={refresh}
        handleView={handleView}
      />
      {/* <AuditWorkOrder
        open={workOrderOpen}
        onClose={() => setWorkOrderOpen(false)}
        handleView={handleView}
        auditRecord={selectedItem}
      /> */}
      <Box display="flex" justifyContent="flex-end" width="100%">
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data?.length > 0 ? -1 : 0}
          labelRowsPerPage="Linhas por página"
          rowsPerPage={filters.perPage}
          page={filters.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
          }
        />
      </Box>
      {selectedItem && (
        <AuditItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default AuditList;
