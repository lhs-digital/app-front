import {
  Card,
  CardContent,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useUserState } from "../../hooks/useUserState";
import api from "../../services/api";

const CompanySelector = ({ company, setCompany, table, setTable }) => {
  const { permissions, isLighthouse } = useUserState().state;

  const { data: companies } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await api.get("/companies/get_companies");
      return response.data.data;
    },
    enabled: isLighthouse,
  });

  const { data: tables } = useQuery({
    queryKey: ["company_tables", company],
    queryFn: async () => {
      const response = await api.get(`/company/auditable_tables`, {
        params: { company_id: company },
      });
      return response.data.data;
    },
    enabled: !!company,
  });

  return (
    <Card variant="outlined">
      <CardContent className="flex flex-row gap-4">
        <div className="w-3/4">
          <FormControl fullWidth>
            <FormLabel id="company-label">Empresa</FormLabel>
            <Select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              {companies?.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="w-1/4">
          <FormControl fullWidth>
            <FormLabel id="company-label">Tabela</FormLabel>
            <Select value={table} onChange={(e) => setTable(e.target.value)}>
              {tables?.map((table) => (
                <MenuItem key={table.id} value={table.label}>
                  {table.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanySelector;
