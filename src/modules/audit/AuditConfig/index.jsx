import { Add, Delete, Edit, Visibility, Widgets, FileOpenOutlined, Timer, TimerOutlined } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalDelete from "../../../components/ModalDelete";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import api from "../../../services/api";
import { qc } from "../../../services/queryClient";
import AuditIntervalModal from "./components/AuditIntervalModal";

const AuditConfig = () => {
  const { company } = useCompany();
  const [isPolling, setIsPolling] = useState(false);
  const [isIntervalOpen, setIsIntervalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 10,
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
      setIsPolling(true); // Inicia o polling quando a auditoria começa
    },
    onError: () => {
      toast.error("Erro ao iniciar a auditoria.");
    },
  });

  // dando get nos logs da rota /audit/logs para colocar na tabela da pagina
  const { data: logs = [], isLoading: isLoadingLogs, refetch: refetchLogs } = useQuery({
    queryKey: ["auditLogs", company?.id],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/audit/logs`);
      return response.data.data;
    },
    enabled: !!company,
  });

  // Atualiza os dados da tabela a cada 3 segundos
  useEffect(() => {
    if (!company?.id || !isPolling) return;

    const interval = setInterval(() => {
      refetchLogs();
    }, 3000);

    // Parar o polling após 30 segundos
    const timeout = setTimeout(() => {
      setIsPolling(false);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [company?.id, refetchLogs, isPolling]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <PageTitle
        title="Configurações e Logs de Auditoria"
        icon={<Widgets />}
        subtitle="Gerencie as configurações e logs de auditoria da empresa"
        buttons={[
          <Tooltip
            title={`Iniciar auditoria manualmente da empresa atual: ${company?.name}`}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => startingAudit()}
              disabled={isStarting}
              startIcon={<FileOpenOutlined />}
            >
              Iniciar Auditoria
            </Button>
          </Tooltip>,
          <Tooltip
            title={`Definir Intervalo de Auditoria da empresa atual: ${company?.name}`}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsIntervalOpen(true)}
              startIcon={<TimerOutlined />}
            >
              Definir Intervalo de Auditoria
            </Button>
          </Tooltip>,

        ]}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Iniciada em</TableCell>
              <TableCell>Empresa</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Duração (s)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              isLoadingLogs ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell >
                      <Skeleton variant="text" height={52} />
                    </TableCell>
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
                  <TableCell >{m.executed_at}</TableCell>
                  <TableCell >{m.company?.name}</TableCell>
                  <TableCell >{m.status === "success" ? "Concluída" : "Falhou"}</TableCell>
                  <TableCell >{m.duration}</TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={pagination.total || 0}
          rowsPerPage={pagination.perPage}
          page={pagination.current}
          onPageChange={(_, newPage) =>
            setPagination({ ...pagination, page: newPage })
          }
          onRowsPerPageChange={(e) =>
            setPagination({ ...pagination, rowsPerPage: e.target.value })
          }
        />
      </TableContainer>

      <AuditIntervalModal
        isOpen={isIntervalOpen}
        onClose={() => setIsIntervalOpen(false)}
      />
    </div>
  );
};

export default AuditConfig;
