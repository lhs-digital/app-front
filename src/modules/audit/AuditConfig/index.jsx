import {
  PlayCircleOutline,
  QueryBuilder,
  SaveOutlined,
  Settings,
  Subject,
} from "@mui/icons-material";
import {
  Button,
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { qc } from "../../../services/queryClient";
import AuditIntervalForm from "./components/AuditIntervalForm";

const AuditConfig = () => {
  const { company } = useCompany();
  const [isPolling, setIsPolling] = useState(false);
  const [interval, setInterval] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 15,
    current: 1,
  });

  const { mutate: startingAudit, isLoading: isStarting } = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/companies/${company.id}/audit`);
      return response.data;
    },
    onSuccess: async () => {
      toast.success("Auditoria iniciada com sucesso.");
      qc.invalidateQueries(["auditLogs", company?.id]);
      setIsPolling(true);
    },
    onError: () => {
      toast.error("Erro ao iniciar a auditoria.");
    },
  });

  const submitInterval = () => {
    if (interval === summary.audit_interval) {
      toast.info("Não houve alterações no intervalo de auditoria.");
      return;
    }

    updateInterval(interval);
  };

  const { mutate: updateInterval, isLoading: isUpdating } = useMutation({
    mutationFn: async (newInterval) => {
      const response = await api.put(
        `/companies/${company?.id}/audit_interval`,
        {
          audit_interval: newInterval,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Intervalo de auditoria atualizado com sucesso.");
    },
  });

  const { data: summary, isPending: isPendingSummary } = useQuery({
    queryKey: ["auditSummary", company?.id],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/audit/summary`);
      setInterval(response.data.audit_interval);
      return response.data;
    },
    enabled: !!company,
  });

  const { data: logs = [], isPending: isLoadingLogs } = useQuery({
    queryKey: ["auditLogs", company?.id],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/audit/logs`);
      setPagination({
        total: response.data.meta.total,
        perPage: response.data.meta.per_page,
        current: response.data.meta.current_page - 1,
      });
      return response.data.data;
    },
    enabled: !!company,
    staleTime: isPolling ? 3000 : 50000,
  });

  return (
    <div className="flex flex-col gap-10 w-full">
      <PageTitle
        title="Configurações de Auditoria"
        icon={<Settings />}
        subtitle="Gerencie as configurações e registros de auditoria da empresa"
        buttons={[
          <Tooltip
            key="start-audit"
            title={`Iniciar auditoria manualmente da empresa atual: ${company?.name}`}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => startingAudit()}
              disabled={isStarting}
              startIcon={<PlayCircleOutline />}
            >
              Iniciar Auditoria
            </Button>
          </Tooltip>,
        ]}
      />
      <Card className="p-4 flex flex-row items-center gap-5">
        <div className="flex flex-row items-center gap-2 flex-shrink-0">
          <QueryBuilder />
          <p className="flex-shrink-0">Auditorias realizadas a cada</p>
        </div>
        <AuditIntervalForm interval={interval} onChange={setInterval} />
        <Button
          className="flex-shrink-0 h-14"
          size="large"
          variant="outlined"
          color="primary"
          onClick={() => submitInterval()}
          startIcon={<SaveOutlined />}
          loading={isPendingSummary}
          disabled={isUpdating}
        >
          Atualizar intervalo
        </Button>
      </Card>
      <div className="flex flex-col">
        <div className="flex gap-2 border-b border-[--border] pb-4">
          <Subject />
          <h2 className="text-lg font-semibold">Registros de auditoria</h2>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Iniciada em</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Duração (s)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                isLoadingLogs ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton variant="text" height={52} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" height={52} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" height={52} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>Nenhum log encontrado</TableCell>
                  </TableRow>
                )
              ) : (
                logs.map((m, index) => (
                  <TableRow key={index}>
                    <TableCell>{m.executed_at}</TableCell>
                    <TableCell>
                      {m.status === "success" ? "Concluída" : "Falhou"}
                    </TableCell>
                    <TableCell>{m.duration}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 15, 20, 25, 50, 100]}
            component="div"
            labelRowsPerPage="Linhas por página"
            count={pagination.total || 0}
            rowsPerPage={pagination.perPage}
            page={pagination.current}
            onPageChange={(_, newPage) =>
              setPagination({ ...pagination, page: newPage })
            }
            onRowsPerPageChange={(e) =>
              setPagination({ ...pagination, rowsPerPage: e.target.value })
            }
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        </TableContainer>
      </div>
    </div>
  );
};

export default AuditConfig;
