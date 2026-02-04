import { Assignment, Business, Dashboard, People } from "@mui/icons-material";
import { Box, Card, CardContent, LinearProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../../hooks/useCompany";
import { useUserState } from "../../../hooks/useUserState";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { formatCpfCnpj } from "../../../services/formatters";
import { hasPermission } from "../../../services/utils";
import MiscSection from "./components/MiscSection";
import RecentItemsCard from "./components/RecentItemsCard";

const Home = () => {
  const navigate = useNavigate();
  const { company } = useCompany();
  const { state: userState } = useUserState();
  const { permissions } = userState;

  useEffect(() => {
    document.title = "LHS - Dashboard";
  }, []);

  // Fetch users count
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["dashboard_users", company?.id],
    queryFn: async () => {
      const response = await api.get("/users", {
        params: {
          per_page: 1,
          company_id: company?.id || undefined,
        },
      });
      return {
        total: response.data.meta?.total || 0,
        recent: response.data.data?.slice(0, 5) || [],
      };
    },
    enabled:
      hasPermission(permissions, "view_users") ||
      hasPermission(permissions, "view_any_users"),
  });

  // Fetch companies count
  const { data: companiesData, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ["dashboard_companies"],
    queryFn: async () => {
      const response = await api.get("/companies", {
        params: { per_page: 1 },
      });
      return {
        total: response.data.meta?.total || 0,
        recent: response.data.data?.slice(0, 5) || [],
      };
    },
    enabled:
      hasPermission(permissions, "view_companies") ||
      hasPermission(permissions, "view_any_companies"),
  });

  // Fetch work orders count
  const { data: workOrdersData, isLoading: isLoadingWorkOrders } = useQuery({
    queryKey: ["dashboard_work_orders", company?.id],
    queryFn: async () => {
      const response = await api.get("/work_order", {
        params: {
          company_id: company?.id || undefined,
          per_page: 100,
        },
      });
      const allOrders = response.data?.data || [];
      const pending = allOrders.filter(
        (wo) => wo.status === "incomplete",
      ).length;
      const completed = allOrders.filter(
        (wo) => wo.status === "complete",
      ).length;
      return {
        total: allOrders.length,
        pending,
        completed,
        recent: allOrders.slice(0, 5),
      };
    },
    enabled:
      !!company &&
      (hasPermission(permissions, "view_work_orders") ||
        hasPermission(permissions, "view_any_work_orders")),
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <PageTitle
        title="Início"
        icon={<Dashboard fontSize="small" />}
        subtitle={`Bem vindo de volta, ${userState?.name || "N/A"}!`}
      />

      {/* Recent Items & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hasPermission(permissions, "view_users") ||
        hasPermission(permissions, "view_any_users") ? (
          <RecentItemsCard
            title="Usuários Recentes"
            items={usersData?.recent}
            isLoading={isLoadingUsers}
            icon={<People fontSize="small" />}
            getItemLabel={(item) => `${item.name} - ${item.email}`}
            onItemClick={() => navigate(`/usuarios`)}
          />
        ) : null}

        {hasPermission(permissions, "view_clients") ||
        hasPermission(permissions, "view_any_clients") ? (
          <RecentItemsCard
            title="Últimas Empresas"
            items={companiesData?.recent}
            isLoading={isLoadingCompanies}
            icon={<Business fontSize="small" />}
            getItemLabel={(item) =>
              `${item.dba || item.name} - ${formatCpfCnpj(item.cnpj)}`
            }
            onItemClick={(item) => navigate(`/empresas/${item.id}`)}
          />
        ) : null}

        {hasPermission(permissions, "view_work_orders") ||
        hasPermission(permissions, "view_any_work_orders") ? (
          <RecentItemsCard
            title="Ordens Recentes"
            items={workOrdersData?.recent}
            isLoading={isLoadingWorkOrders}
            icon={<Assignment fontSize="small" />}
            getItemLabel={(item) => {
              const status =
                item.status === "complete" ? "Concluída" : "Pendente";
              return `OS #${item.id} - ${status}`;
            }}
            onItemClick={() => navigate("/ordens-de-servico")}
          />
        ) : null}
      </div>

      {/* Work Orders Progress */}
      {workOrdersData &&
        (workOrdersData.total > 0 ||
          workOrdersData.pending > 0 ||
          workOrdersData.completed > 0) && (
          <Card>
            <CardContent>
              <div className="flex flex-row gap-2 items-center mb-4">
                <h2 className="font-medium">Status das Ordens de Serviço</h2>
              </div>
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <p>Concluídas</p>
                  <p className="font-bold">
                    {workOrdersData.completed} / {workOrdersData.total}
                  </p>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    workOrdersData.total > 0
                      ? (workOrdersData.completed / workOrdersData.total) * 100
                      : 0
                  }
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <p>Pendentes</p>
                  <p className="font-bold">
                    {workOrdersData.pending} / {workOrdersData.total}
                  </p>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    workOrdersData.total > 0
                      ? (workOrdersData.pending / workOrdersData.total) * 100
                      : 0
                  }
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        )}

      {/* Misc Section */}
      <MiscSection />
    </div>
  );
};

export default Home;
