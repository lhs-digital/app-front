import { TableChart } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import GenericTable from "../../../components/DynamicForm/GenericTable";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { mockClientTable } from "../../../services/mock/clientTable";

const AuditTables = () => {
  const { company } = useCompany();
  const [table, setTable] = useState("");

  const { data: tables = [], isLoading: areTablesLoading } = useQuery({
    queryKey: ["company_tables", company],
    queryFn: async () => {
      const response = await api.get(`/company/auditable_tables`, {
        params: { company_id: company.id },
      });
      setTable(response.data.data[0]);
      return response.data.data;
    },
    enabled: !!company,
  });
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
            disabled={areTablesLoading}
            onChange={(e) => setTable(e.target.value)}
          >
            {tables.map((table) => (
              <MenuItem key={table.id} value={table} className="capitalize">
                {table.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <GenericTable {...mockClientTable} tableName={table.name} />
    </div>
  );
};

export default AuditTables;
