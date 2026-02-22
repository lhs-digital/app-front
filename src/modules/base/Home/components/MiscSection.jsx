import {
  ControlPoint,
  Info,
  NotificationsActive,
  OpenInNew,
  Settings,
  Timeline,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AuditStatus from "../../../../components/AuditComponents/AuditStatus";
import { useCompany } from "../../../../hooks/useCompany";
import { useUserState } from "../../../../hooks/useUserState";
import api from "../../../../services/api";
import { formatDuration } from "../../../../services/formatters";
import { hasPermission } from "../../../../services/utils";

const MiscSection = () => {
  const navigate = useNavigate();
  const { company } = useCompany();
  const { state: userState } = useUserState();
  const { permissions, isLighthouse } = userState;

  const { data: auditLogs = [] } = useQuery({
    queryKey: ["dashboard_audit_logs", company?.id],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/audit/logs`, {
        params: { per_page: 5 },
      });
      return response.data.data?.slice(0, 5) || [];
    },
    enabled: !!company && hasPermission(permissions, "view_any_logs"),
  });

  const quickLinks = [
    {
      icon: <Settings fontSize="small" />,
      label: "Configurações",
      path: "/permissoes",
      permissions: [],
    },
    {
      icon: <Timeline fontSize="small" />,
      label: "Relatórios",
      path: "/auditorias",
      permissions: ["report_generate"],
    },
    {
      icon: <Info fontSize="small" />,
      label: "Minhas Permissões",
      path: "/permissoes",
      permissions: [],
    },
  ];

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      {/* Recent Audit Activity */}

      <Box flex={1}>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center mb-4">
            <NotificationsActive fontSize="small" />
            <h2 className="font-medium">Atividade de Auditoria</h2>
          </div>
          <Tooltip title="Ver todas as auditorias">
            <IconButton
              color="primary"
              size="small"
              className="w-8 h-8"
              onClick={() => navigate("/auditorias")}
            >
              <span className="!aspect-square mb-0.5">
                <OpenInNew fontSize="14px" />
              </span>
            </IconButton>
          </Tooltip>
        </div>
        <Card>
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Auditoria</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Duração</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{log.executed_at}</TableCell>
                        <TableCell>
                          <AuditStatus status={log.status} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          {formatDuration(log.duration)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Nenhuma auditoria encontrada
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      <Box display="flex" flexDirection={{ xs: "column", lg: "row" }} gap={3}>
        {/* Quick Links */}
        <Box flex={1}>
          <div className="flex flex-row gap-2 items-center mb-4">
            <ControlPoint fontSize="small" />
            <h2 className="font-medium">Links Rápidos</h2>
          </div>
          <Box display="flex" flexDirection="column" gap={1}>
            {quickLinks.map((link, index) => {
              const hasAccess =
                link.permissions.length === 0 ||
                link.permissions.some((perm) =>
                  hasPermission(permissions, perm),
                );
              if (!hasAccess) return null;

              return (
                <Card key={index}>
                  <CardActionArea onClick={() => navigate(link.path)}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "primary.light",
                            color: "primary.main",
                          }}
                        >
                          {link.icon}
                        </Box>
                        <p className="font-medium">{link.label}</p>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* System Info */}
        <Box flex={1}>
          <div className="flex flex-row gap-2 items-center mb-4">
            <Info fontSize="small" />
            <h2 className="font-medium">Informações do Sistema</h2>
          </div>
          <Box
            display="flex"
            flexDirection={{ xs: "column", lg: "row" }}
            gap={2}
          >
            <Card className="flex-1">
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  {!company && isLighthouse ? (
                    <Box>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Empresa Atual
                      </p>
                      <p className="font-medium text-sm">
                        Nenhuma empresa selecionada
                      </p>
                    </Box>
                  ) : (
                    company && (
                      <Box>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Empresa Atual
                        </p>
                        <p className="font-medium">{company.name}</p>
                      </Box>
                    )
                  )}
                </Box>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent>
                <Box>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Usuário Logado
                  </p>
                  <p className="font-medium">{userState?.name || "N/A"}</p>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MiscSection;
