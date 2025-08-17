import { Add, Delete, Edit, Visibility, Widgets } from "@mui/icons-material";
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

const AuditModules = () => {
  const { company } = useCompany();
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 10,
    current: 1,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      qc.invalidateQueries(["modules"]);
    }
  }, [company]);

  const { data: modules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ["modules", company, pagination.current, pagination.perPage],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/audit/modules`, {
        params: {
          page: pagination.current,
          per_page: pagination.perPage,
        },
      });
      if (response.data.meta) {
        setPagination((prev) => ({
          ...prev,
          total: response.data.meta.total || response.data.data.length,
          perPage: response.data.meta.per_page,
          current: response.data.meta.current_page,
        }));
      }
      return response.data.data;
    },
    enabled: !!company,
  });

  const { mutate: deleteModule } = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(
        `/companies/${company.id}/audit/modules/${id}`,
      );
      return response.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["modules"]);
      toast.success(`Módulo "${moduleToDelete?.name}" excluído com sucesso!`);
      setIsDeleteModalOpen(false);
      setModuleToDelete(null);
    },
  });

  const handleDeleteClick = (module) => {
    setModuleToDelete(module);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (moduleToDelete) {
      deleteModule(moduleToDelete.id);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setModuleToDelete(null);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <PageTitle
        title="Regras de Auditoria"
        icon={<Widgets />}
        subtitle="Gerencie as regras de auditoria das empresas"
        buttons={[
          <Button
            key="create-module"
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              navigate("/modulos/criar");
            }}
          >
            Criar grupo
          </Button>,
        ]}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Grupo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.length === 0 ? (
              isLoadingModules ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-10/12">
                      <Skeleton variant="text" height={52} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" height={52} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>Nenhum módulo encontrado</TableCell>
                </TableRow>
              )
            ) : (
              modules.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="w-10/12">{m.name}</TableCell>
                  <TableCell className="space-x-2">
                    <IconButton
                      onClick={() => navigate(`/modulos/${m.id}`)}
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/modulos/${m.id}/editar`)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(m)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
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
      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        content={
          <p>
            Você tem certeza que deseja excluir o módulo &quot;
            {moduleToDelete?.name}&quot;?
          </p>
        }
      />
    </div>
  );
};

export default AuditModules;
