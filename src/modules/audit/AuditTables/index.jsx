import { TableChart } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GenericTable from "../../../components/DynamicForm/GenericTable";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";

const AuditTables = () => {
  const { company } = useCompany();
  const [table, setTable] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    perPage: 10,
  });

  const {
    data: tableOptions = [],
    isLoading: areOptionsLoading,
    isPending: isOptionsPending,
  } = useQuery({
    queryKey: ["company_tables", company],
    queryFn: async () => {
      const response = await api.get(`/company/auditable_tables`, {
        params: { company_id: company.id },
      });
      if (response.data.data.length > 0) {
        setTable(response.data.data[0]);
      }
      return response.data.data;
    },
    enabled: !!company,
  });

  const {
    data: tableData = [],
    isLoading: isTableDataLoading,
    isError: isTableDataError,
  } = useQuery({
    queryKey: ["table_data", table],
    queryFn: async () => {
      const response = await api.get(`/module/${table.name}`, {
        params: {
          page: pagination.current,
          per_page: pagination.perPage,
        },
      });
      setPagination({
        total: response.data.total,
        current: response.data.current_page,
        perPage: response.data.per_page,
      });
      return response.data.data;
    },
    retry: false,
    enabled: !!table,
  });

  useEffect(() => {
    if (isTableDataError) {
      toast.error("Erro ao carregar dados da tabela");
    }
  }, [isTableDataError]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageTitle
        title="Tabelas de auditoria"
        icon={<TableChart />}
        subtitle="Visualize entidades das tabelas auditáveis"
      />
      <div className="w-full">
        <FormControl fullWidth>
          <InputLabel id="table-select">Tabela</InputLabel>
          <Select
            fullWidth
            labelId="table-select"
            className="capitalize"
            value={table}
            label="Tabela"
            disabled={areOptionsLoading || isOptionsPending}
            onChange={(e) => setTable(e.target.value)}
          >
            {tableOptions.map((table) => (
              <MenuItem key={table.id} value={table} className="capitalize">
                {table.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {isOptionsPending ? (
        <Skeleton variant="rectangular" height={350} />
      ) : (
        <GenericTable
          data={tableData}
          isLoading={isTableDataLoading}
          tableName={table.name}
          pagination={pagination}
          onPageChange={setPagination}
          onRowsPerPageChange={setPagination}
        />
      )}
    </div>
  );
};

export default AuditTables;
