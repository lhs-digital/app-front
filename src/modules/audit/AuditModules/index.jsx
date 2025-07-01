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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../../hooks/useCompany";
import PageTitle from "../../../layout/components/PageTitle";
import ModalDelete from "../../../components/ModalDelete";
import api from "../../../services/api";
import { toast } from "react-toastify";

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
  const queryClient = useQueryClient();

  const { data: modules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ["modules", company],
    queryFn: async () => {
      const response = await api.get(`/companies/${company.id}/audit/modules`, {
        params: {
          page: pagination.current,
          per_page: pagination.perPage,
        },
      });
      if (response.data.meta) {
        setPagination({
          total: response.data.meta.total || response.data.data.length,
          perPage: response.data.meta.per_page,
          current: response.data.meta.current_page,
        });
      }
      return response.data.data;
    },
    enabled: !!company,
    staleTime: 1000 * 60,
  });

  const { mutate: deleteModule } = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(
        `/companies/${company.id}/audit/modules/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["modules", company]);
      toast.success(`Módulo ${moduleToDelete?.name} excluído com sucesso!`);
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
        title="Módulos"
        icon={<Widgets />}
        subtitle="Gerencie os módulos do sistema da empresa"
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
            Criar módulo
          </Button>,
        ]}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Módulo</TableCell>
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
                  <TableCell>
                    <IconButton onClick={() => navigate(`/modulos/${m.id}`)}>
                      <Visibility />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/modulos/${m.id}/editar`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(m)}
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
            Você tem certeza que deseja excluir o módulo &quot;{moduleToDelete?.name}&quot;?
          </p>
        }
      />
    </div>
  );
};

export default AuditModules;
